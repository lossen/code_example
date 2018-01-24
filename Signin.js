import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Content,
  Form,
  Item,
  Input,
  Button,
  Text,
  Footer,
  Label,
  Container
} from 'native-base';
import Header from '../../containers/Header'
import { Image,View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { signIn } from '../../store/user';
import styles from '../../assets/styles/index';
import ErrorModal from '../../utils/ErrorModal';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      initial: true,
    };
  }

  signIn() {
    const { email, password } = this.state;

    this.setState({ initial: false });
    if (!email || !password || password.length < 6) {
      return;
    }
    this.props.actions.signIn(email, password)
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  render() {
    const { initial, email, password } = this.state;
    return (
      <Container>
        <Header title="Account Log In" buttonTitle=" " style={styles.header}/>
        <Content style={{...styles.mainContent }}>
          <View>
            <Form style={styles.mainForm}>
              <View style={styles.mainContentBody}>
                <Item
                    floatingLabel
                    error={!email || !this.validateEmail(email)}
                    style={initial || (email && this.validateEmail(email))
              ? styles.inputPrimary
              : styles.inputPrimaryInvalid}>
                  <Label style={styles.labelPrimary}>Email address</Label>
                  <Input
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onChangeText={newEmail => this.setState({ email: newEmail })}/>
                </Item>
                <Item
                    floatingLabel
                    error={!password || password.length < 6}
                    style={initial || (password && password.length >= 6)
              ? styles.inputPrimary
              : styles.inputPrimaryInvalid}>
                  <Label style={styles.labelPrimary}>Password</Label>
                  <Input
                      secureTextEntry
                      onChangeText={newPassword => this.setState({ password: newPassword })}
                  />
                </Item>
                <Text style={styles.text}>Reset your password</Text>
              </View>
              <View style={{...styles.mainContentFooter, ...styles.noMarginRight, ...styles.noMarginLeft}}>
                <Button style={styles.btnPrimary} full light onPress={() => this.signIn()}>
                  <Text style={styles.btnPrimaryText}>Log In</Text>
                </Button>

                <View style={styles.flexRow}>
                  <Text style={styles.text}>
                    Don’t have an account?
                  </Text>
                  <Button onPress={Actions.signin} style={[styles.buttonLink]}>
                    <Text onPress={Actions.signup} style={{...styles.linkPrimary}}>Register</Text>
                  </Button>
                </View>
              </View>
            </Form>
          </View>

        </Content>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    signIn,
  }, dispatch),
});

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, mapDispatchToProps)(Login);
