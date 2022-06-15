// import {Action, createFeatureSelector, createReducer, createSelector, on} from "@ngrx/store";
// import {getCategories} from "../actions/assessment_data.actions";
// import {CategoryState} from "./categoryState.states";
// import {initialCategoryState} from "./assessment.reducer";
//
// const _categoryReducer = createReducer(
//   initialCategoryState,
//   on(getCategories, (state, {payload}) => (
//     {category:payload})
//   )
// )
// export function categoryReducer1(state:any, action:Action){
//   return _categoryReducer(state, action)
// }
//
// export const getCategoryState = createFeatureSelector<CategoryState>("categoryState")
//
// export const getCategory = createSelector(
//   getCategoryState, (state:CategoryState) => {
//     return state.category
//   }
// )
