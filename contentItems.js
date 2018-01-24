import * as api from '../api';
import RealmModels from '../models/RealmModels';
import ErrorModal from '../utils/ErrorModal';

const SET_CONTENT_ITEMS = 'SET_CONTENT_ITEMS',
    SET_ACTIVE_LESSON = 'SET_ACTIVE_LESSON',
    SET_COMPLETED_ITEMS = 'SET_COMPLETED_ITEMS',
    SET_STOP_PLACE = 'SET_STOP_PLACE',
    SET_LAST_COMPLETED_LESSON = 'SET_LAST_COMPLETED_LESSON',
    GET_TRAIN_COMPLETION = 'GET_TRAIN_COMPLETION',
    GET_SECTIONS_STATUS = 'GET_SECTIONS_STATUS',
    SET_VALUE_REFOCUS = 'SET_VALUE_REFOCUS',
    POST_GRATITUDES = 'POST_GRATITUDES';


const initialState = {
    video_items:[],
    audio_items:[],
    entry_list_items:[],
    quiz_items:[],
    learn_items:[],
    train_items:[],
    help_items:[],
    gratitudes_items: [],
    series_ids:[],
    train_completed_series_ids:[],
    active_lesson:0,
    stop_place:{},
    learn_section_complete:false,
    train_completion: {
        all_sessions:0,
        completed_sessions:0,
        percent_progress:0
    },
    completed_items:[],
    last_completed_lesson:0,
    train_started:false,
    total_time:0,
    streak_interval:0,
    values_refocus:[],
    gratitudes_taken_today: false,
    gratitudes_present: false,
    value_exists: false,
};

export const getContentItems = (course_type,tool_id,section_type,email) => (dispatch, getState) => {
    const { user } = getState();
    return new Promise((resolve,reject) => {
       return api.fetchGetItems(course_type,tool_id,section_type,email, user.user_token)
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch({
                    type: SET_CONTENT_ITEMS,
                    ...responseJson
                });
                resolve(responseJson)
            })
    })

    };

export const setAudioTimeInfo = (data) => (dispatch) => {
    return new Promise((resolve,reject) => {
        api.fetchPostAudioTimeInfo(data)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.success){
                    resolve(responseJson)
                }else{
                    reject(responseJson)
                }
            })
    })

};

export const setVideoTimeInfo = (data) => (dispatch) => {
    return new Promise((resolve,reject) => {
        api.fetchPostVideoTimeInfo(data)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.success){
                    resolve(responseJson)
                }else{
                    reject(responseJson)
                }
            })
    })

};

export const setChapterVideoTimeInfo = (data) => (dispatch) => {
    return new Promise((resolve,reject) => {
        api.fetchPostChapterVideoTimeInfo(data)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.success){
                    resolve(responseJson)
                }else{
                    reject(responseJson)
                }
            })
    })

};

export const setActiveLesson = (active_lesson) => (dispatch) => {
    return new Promise((resolve,reject) => {
        dispatch({
            type:SET_ACTIVE_LESSON,
            active_lesson
        })
        resolve()
    })

}

export const setLastCompletedLesson = (last_completed_lesson) => (dispatch) => {
    return new Promise((resolve,reject) => {
        dispatch({
            type:SET_LAST_COMPLETED_LESSON,
            last_completed_lesson
        })
        resolve()
    })

}

export const getCompletedItems = (auth_token,email) => (dispatch, getState) => {
    const { user } = getState();
    return new Promise((resolve,reject) => {
        return api.fetchUserInteractions(user.user_token, email)
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch({
                    type:SET_COMPLETED_ITEMS,
                    completed_items:responseJson
                })
                resolve(responseJson)
            })
    })
}

export const getStopPlace = (auth_token,email) => (dispatch, getState) => {
    const { user } = getState();
    return new Promise((resolve,reject) => {
        return api.fetchStopPlace(user.user_token, email)
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch({
                    type:SET_STOP_PLACE,
                    stop_place:responseJson.stop_place
                })
                resolve(responseJson)
            })
    })
}

export const getTrainCompletion = (auth_token,email,course_type,tool_id) => (dispatch, getState) => {
    const { user } = getState();
    return new Promise((resolve,reject) => {
        return api.fetchTrainCompletion(user.user_token, email,course_type,tool_id)
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch({
                    type:GET_TRAIN_COMPLETION,
                    train_completion:responseJson
                })
                resolve(responseJson)
            })
    })
}

export const getSectionsStatus = (auth_token,email,tool_id,course_type) => (dispatch, getState) => {
    const { user } = getState();
    return new Promise((resolve,reject) => {
        return api.fetchSectionsStatus(user.user_token, email,tool_id,course_type)
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch({
                    type:GET_SECTIONS_STATUS,
                    data:responseJson
                })
                resolve(responseJson)
            })
            .catch((err) => {
                dispatch({
                    type:GET_SECTIONS_STATUS,
                    data:{
                        learn_section_complete:initialState.learn_section_complete,
                        train_completion:initialState.train_completion,
                        train_started:initialState.train_started,
                        gratitudes_taken_today:initialState.gratitudes_taken_today,
                        gratitudes_present:initialState.gratitudes_present,
                        value_exists:initialState.value_exists,
                    }
                })
            })
    })
}

export const getGeneralTrainingTime = (auth_token,email,course_type) => (dispatch, getState) => {
    const { user } = getState();
    return new Promise((resolve,reject) => {
        return api.fetchGeneralTrainingTime(user.user_token, email, course_type)
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch({
                    type:GET_SECTIONS_STATUS,
                    data:responseJson
                })
                resolve(responseJson)
            })
    })
}

export const postQuizResults = (user_email, correct_answers, incorrect_answers) => (dispatch, getState) => {
  const { user } = getState();
  return new Promise((resolve,reject) => {
    const body = {
      course_type: 3,
      user_token: user.user_token,
      user_email,
      correct_answers,
      incorrect_answers,
    };
    return api.postQuizResults(body)
      .then((res) => {
        resolve();
      })
      .catch(err => {
        reject();
      });
  });
}

export const postGratitudesResults = (tool_id, email, gratitudes) => (dispatch, getState) => {
  const { user } = getState();

  return new Promise((resolve,reject) => {
    const body = {
      user_email: email,
      user_token: user.user_token,
      gratitudes,
    };
    return api.postGratitudes(tool_id, body)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.errors) {
          reject(responseJson.errors);
        } else {
          dispatch({
            type: GET_SECTIONS_STATUS,
            data: {
              gratitudes_taken_today: true,
              gratitudes_present: true,
            }
          })
          resolve(responseJson);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

export const getValuesRefocus = (tool_id,email, user_token) => (dispatch) => {
    return new Promise((resolve,reject) => {
        return api.getValuesRefocus(tool_id,email, user_token)
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch({
                    type:SET_VALUE_REFOCUS,
                    values_refocus:responseJson.items
                })
                resolve(responseJson)
            })
    })
}

export const postValuesRefocus = (tool_id,email,file,order,title) => (dispatch, getState) => {
    const { user } = getState();
    var formData = new FormData()
    formData.append('user_email', email);
    formData.append('user_token', user.user_token);
    formData.append('file', file );
    formData.append('order', order );
    formData.append('title', title );

    return new Promise((resolve,reject) => {
        return api.postValuesRefocus(tool_id,formData)
            .then((response) => response.json())
            .then((responseJson) => {
              resolve();
            })
            .catch(err => {
              ErrorModal.show('Error');
              reject();
            });
    })
}

const ACTION_HANDLERS = {
    [SET_CONTENT_ITEMS]: (state, action) => ({
        ...state,
        train_items:action.train_items,
        learn_items:action.learn_items,
        series_ids:action.series_ids,
        help_items:action.help_items,
        stop_place:action.stop_place,
        quiz_items:action.quiz_items,
        gratitudes_items:action.gratitudes_items,
        let_go_items:action.let_go_items,
        body_scan_items:action.body_scan_items,
    }),
    [SET_ACTIVE_LESSON]: (state,action) => ({
        ...state,
        active_lesson:action.active_lesson
    }),
    [SET_COMPLETED_ITEMS]: (state,action) => ({
        ...state,
        completed_items:action.completed_items
    }),
    [SET_STOP_PLACE]: (state,action) => ({
        ...state,
        stop_place:action.stop_place
    }),
    [SET_LAST_COMPLETED_LESSON]: (state,action) => ({
        ...state,
        last_completed_lesson:action.last_completed_lesson
    }),
    [GET_TRAIN_COMPLETION]: (state,action) => ({
        ...state,
        train_completion:action.train_completion
    }),
    [GET_SECTIONS_STATUS]: (state,action) => ({
        ...state,
        ...action.data
    }),
    [SET_VALUE_REFOCUS]: (state,action) => ({
        ...state,
        values_refocus:action.values_refocus
    })
};


export default function contentItems(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}

