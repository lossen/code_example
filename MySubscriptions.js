import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
    Text,
    Button,
    Content,
    Icon,
    Right,
    Left
} from 'native-base';
import Header from '../../containers/Header'
import { Actions } from 'react-native-router-flux';
import { Image, View, ScrollView, TouchableOpacity,Alert } from 'react-native';
import styles,{combineStyles} from '../../assets/styles/index';
import stripe from 'tipsi-stripe'
import {postPayments,getSubscriptionsInfo} from '../../store/subscriptions'
import ActiveSubscription from './ActiveSubscription'
import Spinner from '../../components/Spinner'
import moment from 'moment'


class MySubscriptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPlanId:'',
            stripeToken:'',
            visibleSpinner:false
        }
        this.paymentData = {},
        this.statusExpired = moment(props.subscription_info.subscribed_before).format('X') <= moment().format('X')
    }

   

    renderAmount(plan){
        if(plan.interval === 'year'){
            return(
                this.renderCurrency(plan.currency) + (plan.amount / 12)/100
            )
        }else if(plan.interval === 'month'){
            return(
                this.renderCurrency(plan.currency) + (plan.amount / plan.interval_count)/100
            )
        }else{
            return(
                this.renderCurrency(plan.currency) + (plan.amount * 30)/100
            )
        }
    }

    renderCurrency(currency){
        if(currency === 'gbp'){
            return '£'
        }
    }

    handleSelectPlan(id,plan){
        this.setState({
            selectedPlanId:id,
        })
    }

    handlePurchase(){
        this.setState({
            visibleSpinner:true
        })
        const {email,stripeToken,plan_id,course_type} = this.paymentData;
        if(!email || !plan_id || !course_type){
            return;
        }
        const options = {
            smsAutofillDisabled: true,
            requiredBillingAddressFields: 'zip',
        };
        stripe.paymentRequestWithCardForm(options)
            .then(response => {
                if(response.tokenId){
                    this.setState({
                        stripeToken:response.tokenId
                    })
                    this.props.postPayments(this.paymentData).then((res) => {
                        this.props.getSubscriptionsInfo(this.props.user.email,3).then(() => {
                            this.setState({
                                visibleSpinner:false
                            })
                        })
                    })
                }
            })
    }

  render() {
      const {subscription_plans,subscription_info} = this.props;
      const {email} = this.props.user;
      const {selectedPlanId,stripeToken} = this.state;
      this.paymentData = {email,stripeToken,plan_id:selectedPlanId,course_type:3}
      if(!this.statusExpired && this.props.subscription_info.plan_id){
          return <ActiveSubscription/>
      }
      return (
          <View style={{...styles.mainContent,backgroundColor:'rgb(242, 242, 242)' }}>
              <Spinner visible={this.state.visibleSpinner}/>
              <Header title="My Subscriptions" style={styles.header} buttonTitle=" "/>
              <Content style={{flex:1}}>
                  <Text style={styles.subscriptionListTitle}>Start sleeping well today.</Text>
                  <View style={styles.subscriptionList}>
                      {subscription_plans.length > 0 && subscription_plans.map((plan) => {
                          return(
                              <TouchableOpacity
                                  style={[styles.subscriptionItemButtonWrap]}
                                  key={plan.id}
                                  onPress={() => this.handleSelectPlan(plan.id,plan)}>
                                  <View
                                      style={selectedPlanId === plan.id
                                      ? [styles.subscriptionItem,styles.subscriptionItemActive]
                                      : [styles.subscriptionItem]} key={plan.id}>
                                      <Left style={styles.subscriptionItemLeft}>
                                          <Text style={styles.subscriptionItemPeriod}>{plan.name}</Text>
                                          <Text style={styles.subscriptionItemPaymentType}>per month</Text>
                                      </Left>
                                      <Right style={styles.subscriptionItemRight}>
                                          <Text style={styles.subscriptionItemPrice}>{this.renderAmount(plan)}</Text>
                                      </Right>
                                  </View>
                              </TouchableOpacity>
                          )
                      })}

                  </View>
                  <View>
                      <Text style={[styles.subscriptionListTitle,styles.subscriptionListTitleDark]}>Recurring billing, cancel anytime</Text>
                      <View style={[styles.inlineTextWrap]}>
                          <Text
                              style={[styles.subscriptionListTitleDark,styles.subscriptionListTitleGrey]}>* billed as one payment </Text>
                          <View style={[styles.textSeparator]}/>
                          <Text
                              style={[styles.subscriptionListTitleDark,styles.subscriptionListTitleGrey]}>Terms & Conditions</Text>
                      </View>
                  </View>
              </Content>
              <Button style={[styles.btnPrimary,{marginBottom:0}]} onPress={() => this.handlePurchase()}>
                  <Text style={styles.btnPrimaryText}>Purchase subscription</Text>
              </Button>

          </View>
    );
  }
}

const mapStateToProps = state => ({
    user: state.user,
    subscription_plans: state.subscriptions.subscription_plans,
    subscription_info: state.subscriptions.subscription_info
});

const mapDispatchToProps = dispatch => bindActionCreators({
    postPayments,
    getSubscriptionsInfo
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(MySubscriptions);
