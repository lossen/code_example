import * as api from '../api'
import ErrorModal from '../utils/ErrorModal';
import RealmModels from '../models/RealmModels'
const SET_SUBSCRIPTION_PLANS = 'SET_SUBSCRIPTION_PLANS',
    SET_SUBSCRIPTION_INFO = 'SET_SUBSCRIPTION_INFO',
    TOGGLE_SUBSCRIBER_MODAL_VISIBLE = 'TOGGLE_SUBSCRIBER_MODAL_VISIBLE';

const initialState = {
    subscription_plans:[],
    subscription_info:{
        subscription_status: 'active',
        subscribed_before: 1508225830,
    },
    subscriber_modal_visible:false
};

export const toggleSubscriberModalVisible = (visible) => (dispatch) => {
    dispatch({
        type:TOGGLE_SUBSCRIBER_MODAL_VISIBLE,
        subscriber_modal_visible:visible
    })
}


export const getSubscriptionPlans = (course_type) => (dispatch, getState) => {
  const { user } = getState();
    return api.fetchGetSubscriptionPlans(course_type, user.user_token)
        .then((response) => response.json())
        .then((responseJson) => {
            dispatch({
                type: SET_SUBSCRIPTION_PLANS,
                subscription_plans: responseJson
            });
        })
};

export const postPayments = (params) => (dispatch) => {
    return new Promise((resolve,reject) => {
        return api.fetchPostPayments(params)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.success){
                    resolve(responseJson)
                    dispatch({
                        type: SET_SUBSCRIPTION_INFO,
                        subscription_info:responseJson
                    });
                    ErrorModal.show(responseJson.message)
                }else{
                    reject(responseJson)
                    ErrorModal.show(responseJson.message)
                }
            })
    })

};

export const cancelSubscription = (params) => (dispatch) => {
    return new Promise((resolve,reject) => {
        return api.fetchCancelSubscription(params)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.success){
                    resolve(responseJson)
                    ErrorModal.show(responseJson.message)
                }else{
                    ErrorModal.show(responseJson.message)
                }
            })
    })

};

export const getSubscriptionsInfo = (email,course_type) => (dispatch, getState) => {
    const { user } = getState();
    return new Promise((resolve,reject) => {
        return api.fetchSubscriptionInfo(user_email, course_type, user.user_token)
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch({
                    type: SET_SUBSCRIPTION_INFO,
                    subscription_info:responseJson
                });
                resolve(responseJson)
            })
    })

};

const ACTION_HANDLERS = {
    [SET_SUBSCRIPTION_PLANS]: (state, action) => ({
        ...state,
        subscription_plans: action.subscription_plans,
    }),
    [SET_SUBSCRIPTION_INFO]: (state, action) => ({
        ...state,
        subscription_info:action.subscription_info
    }),
    [TOGGLE_SUBSCRIBER_MODAL_VISIBLE]: (state,action) => ({
        ...state,
        subscriber_modal_visible: action.subscriber_modal_visible
    })
}


export default function subscriptions(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}

