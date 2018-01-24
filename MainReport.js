import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    Text,
    Button,
    Content,
    Tabs,
    Tab,
    Icon
} from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Image, View, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../../assets/styles/index';
import Header from '../../containers/Header';
import Logo from '../../assets/images/blueCloud.png';
import {getSurveyResults,getSurveyCompareScore} from '../../store/surveyReport';
import {getChapterList,getChapterInfo} from '../../store/chapter';
import {scoreKeys} from '../../constants';
import sleepGrey from '../../assets/images/sleepGrey.png';
import transitionGrey from '../../assets/images/transitionGrey.png';
import resilienceGrey from '../../assets/images/resilienceGrey.png';
import ProgressCircle from '../../components/ProgressCircle';


class MainReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            watchedReadMore:false
        };
    }

    componentWillMount(){
        const { email, user_token } = this.props.user;
        if(this.props.user.email){
            this.props.getSurveyResults({user_email: email, user_token, course_type:3});
            this.props.getSurveyCompareScore({user_email: email, user_token, course_type:3});
        }
    }

    renderColorProgress(progress){
        if(progress >= 67){
            return scoreKeys.aboveAverage
        }else if(progress >= 34){
            return scoreKeys.aboutAverage
        }else{
            return scoreKeys.belowAverage
        }
    }

    renderIcon(title, progress) {
      switch (title) {
        case 'Perform':
          return (<Text style={[styles.sleepIcon, { color: this.renderColorProgress(progress), fontSize: 22, lineHeight: 22, marginBottom: 8 }]}>r</Text>)
          break;
        case 'Transition':
          return (<Text style={[styles.sleepIcon, { color: this.renderColorProgress(progress), fontSize: 20, lineHeight: 20, marginBottom: 8 }]}>w</Text>)
          break;
        case 'Sleep':
          return (<Text style={[styles.sleepIcon, { color: this.renderColorProgress(progress), fontSize: 20, lineHeight: 20, marginBottom: 8 }]}>q</Text>)
          break;
        default:
          return (<Text style={[styles.sleepIcon, { color: this.renderColorProgress(progress), fontSize: 20, lineHeight: 20, marginBottom: 8 }]}>q</Text>)
      }
    }

    render() {
        return (
            <View style={{...styles.mainContent,backgroundColor:'rgb(242, 242, 242)'}}>
                <Header style={styles.header} buttonTitle=" " hiddenLeftButton={true}/>
                <Content>
                    <View style={[styles.headerWithLogo]}>
                        <Image source={Logo} style={[styles.cloudLogo]}/>
                        <Text style={[styles.subscriptionListTitle]}>Your Sleep School Professional report</Text>
                    </View>
                    <View style={styles.centeredContent}>
                        <Text style={[styles.subscriptionListTitle,{color:'rgb(0, 15, 26)',marginBottom:15}]}>Your Overall Score</Text>
                        <ProgressCircle
                            progress={this.props.overall_survey_score}
                            size={128}
                            fontSize={48}
                            styleContainer={{marginBottom:32,alignItems:'center'}}
                            textVisible={true}
                            handlePressArrow={() => {Actions.overallScore({
                                overall_score_descriptions:this.props.overall_score_descriptions,
                                overall_survey_score:this.props.overall_survey_score,
                                chapters_result:this.props.chapters_result,
                                group_result:this.props.group_result,
                                national_result:this.props.national_result,
                                national_overall_score:this.props.national_overall_score,
                                group_overall_score:this.props.group_overall_score,
                                corporate_code:this.props.user.corporate_code
                            }); this.setState({watchedReadMore:true})}}
                        />
                    </View>
                    <View style={[styles.centeredContent,styles.reportChapterList]}>
                        {this.props.chapters_result.map((chapter) => {
                            return(
                                <Button
                                    key={chapter.chapter_id}
                                    style={[styles.centeredContent,styles.reportChapterBox,styles.buttonNoPadding]}
                                    onPress={() => Actions.chapterScore({
                                        chapter_id:chapter.chapter_id,
                                        chapter_progress:chapter.chapter_progress,
                                        chapter_title:chapter.chapter_title,
                                        chapter_descriptions:chapter.chapter_descriptions,
                                    })}>
                                    <View style={styles.reportChapterBoxBody}>
                                        { this.renderIcon(chapter.chapter_title, chapter.chapter_progress) }
                                        <Text
                                            style={[styles.btnSegmentText,styles.reportChapterBoxTextGreen,{color:this.renderColorProgress(chapter.chapter_progress)}]}>{chapter.chapter_title}</Text>
                                    </View>
                                    <View
                                        style={[styles.reportChapterBoxFooter,styles.reportChapterBoxFooterGreen,{backgroundColor:this.renderColorProgress(chapter.chapter_progress)}]}>
                                        <Text style={[styles.reportChapterBoxFooterText]}>Read more</Text>
                                    </View>

                                </Button>
                            )
                        })}
                    </View>
                    <Text style={[styles.scoreKeyItemText,styles.scoreKeyListTitle]}>Score key:</Text>
                    <View style={styles.scoreKeyList}>
                        <View style={styles.scoreKeyItem}>
                            <View style={[styles.scoreKeyItemLine,{backgroundColor:'rgb(38, 200, 149)'}]}/>
                            <Text style={[styles.scoreKeyItemText,{color:'rgb(38, 200, 149)'}]}>Above average</Text>
                        </View>
                        <View style={styles.scoreKeyItem}>
                            <View style={styles.scoreKeyItemLine}/>
                            <Text style={styles.scoreKeyItemText}>About average</Text>
                        </View>
                        <View style={styles.scoreKeyItem}>
                            <View style={[styles.scoreKeyItemLine,{backgroundColor:'rgb(247, 54, 54)'}]}/>
                            <Text style={[styles.scoreKeyItemText,{color:'rgb(247, 54, 54)'}]}>Below average</Text>
                        </View>
                    </View>
                </Content>
                {this.state.watchedReadMore &&
                    <Button
                        style={[styles.btnPrimary,{marginBottom:0}]}
                        onPress={() => {Actions.drawer({type: ActionConst.RESET,leftButtonColor:'#fff'});Actions.dashboard()}}>
                        <Text style={[styles.btnPrimaryText]}>Home</Text>
                    </Button>
                }
            </View>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    chapters_result: state.surveyReport.chapters_result,
    overall_survey_score: state.surveyReport.overall_survey_score,
    overall_score_descriptions: state.surveyReport.overall_score_descriptions,
    group_result: state.surveyReport.group_result,
    national_result: state.surveyReport.national_result,
    group_overall_score: state.surveyReport.group_overall_score,
    national_overall_score: state.surveyReport.national_overall_score,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getSurveyResults,
    getChapterList,
    getChapterInfo,
    getSurveyCompareScore
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainReport);

