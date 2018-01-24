import * as api from '../api'
const SET_CHAPTER_INFO = 'SET_CHAPTER_INFO';
const SET_CHAPTER_LIST = 'SET_CHAPTER_LIST';
const FETCH_TOOL_SCIENCE = 'FETCH_TOOL_SCIENCE';
const SET_TOOL_SCIENCE = 'SET_TOOL_SCIENCE';

const initialState = {
    chapter_info:{},
    chapter_list:{},
    recommended_tools:[],
    main_video:{},
    toolScience: {
      data: [],
      fetching: false,
    },
};

export const getToolScienceInfo = (email, chaptersList)  => (dispatch, getState) => {

  dispatch({
    type: FETCH_TOOL_SCIENCE,
  });

  return new Promise((resolve, reject) => {
    let current = Promise.resolve();
    const { user } = getState();

    const fetchAllChapters = chaptersList.map(chapter => {
      current = current
        .then(() => api.fetchGetChapterInfo(3, chapter.id, email, user.user_token))
        .then((response) => response.json())
        .then(result => ({chapter: chapter, tools: result.tools}) );
      return current;
    });
     Promise.all(fetchAllChapters).then(toolsInfo => {
       dispatch({
         type: SET_TOOL_SCIENCE,
         payload: { data: toolsInfo }
       });
       return resolve();
    });

  });
};


export const getChapterInfo = (course_type, chapter_id, email) => (dispatch, getState) => {
    const { user } = getState();
    return new Promise((resolve, reject) => {
        api.fetchGetChapterInfo(course_type, chapter_id, email, user.user_token)
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch({
                    type: SET_CHAPTER_INFO,
                    chapter_info: {
                        videos: responseJson.videos,
                        tools: responseJson.tools
                    },
                    recommended_tools: responseJson.recommended_tools,
                    main_video: responseJson.main_video,
                });
                resolve()
            })
            .catch((err) => {
                dispatch({
                    type: SET_CHAPTER_INFO,
                    chapter_info: initialState.chapter_info,
                    recommended_tools: initialState.recommended_tools,
                    main_video: initialState.main_video,
                });
                reject()
            })
    })
};

export const getChapterList = (course_type,email) =>
    (dispatch, getState) => {
      const { user } = getState();
      return new Promise((resolve, reject) => {
        api.fetchGetChapterList(course_type,email, user.user_token)
          .then((response) => response.json())
          .then((responseJson) => {
              dispatch({
                  type: SET_CHAPTER_LIST,
                  chapter_list:responseJson.chapters || []
              });
              resolve(responseJson.chapters);
          })
        });
    };


const ACTION_HANDLERS = {
    [SET_CHAPTER_INFO]: (state, action) => ({
        ...state,
        chapter_info: action.chapter_info,
        recommended_tools: action.recommended_tools,
        main_video: action.main_video,
    }),
    [SET_CHAPTER_LIST]: (state, action) => ({
        ...state,
        chapter_list: action.chapter_list,
    }),
    [FETCH_TOOL_SCIENCE]: (state, action) => ({
        ...state,
        toolScience: { fetching: true, data: [] },
    }),
    [SET_TOOL_SCIENCE]: (state, action) => ({
        ...state,
        toolScience: { fetching: false, data: action.payload.data },
    }),
}


export default function contentItems(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}

