import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authService';
import addressReducer from './../features/address/addressSlice';
import authReducer from './../features/auth/authSlice';
import blogReducer from './../features/blog/blogSlice';
import blogCategoryReducer from './../features/blogCategory/blogCategorySlice';
import brandReducer from './../features/brand/brandSlice';
import categoryReducer from './../features/category/categorySlice';
import productReducer from './../features/product/productSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        address: addressReducer,
        categories: categoryReducer,
        brands: brandReducer,
        products: productReducer,
        blogCategories: blogCategoryReducer,
        blogs: blogReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
})
// Định nghĩa các type cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;