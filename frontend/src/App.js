// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import {Navigate} from "react-router-dom";
// Import your pages
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard/index";
import Addproduct from "./pages/Dashboard/add-product/app";
import Catalog from "./pages/catalog";
import Category from "./pages/category/index";
import CategoryProducts from "./pages/category/[categoryName]/app";
import ProductName from "./pages/[productName]/index";
import ContactUs from "./pages/contact-us";
import AboutUs from "./components/About-us";
import NewArrival from './components/new-arrival'
import SearchResultsPage  from './components/SearchResults'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import NotFoundPage from './components/404'
import Logout from './components/Logout'
import OrderManagement from "./components/OrderManagement"; 
import DashboardContactUs from './components/contact-us'
import Dashboard from './components/dashboardCatalog'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/add-product" element={<Addproduct />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:slug" element={<ProductName />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/:categoryName" element={<CategoryProducts />} />
          <Route path="/category/:categoryName/:slug" element={<ProductName />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/new-arrivals" element={<NewArrival />} />
          <Route path="/search" element={<SearchResultsPage />} />
           <Route path="/cart" element={<Cart />} />
           <Route path="/checkout" element={<Checkout />} />
           <Route path="/404" element={<NotFoundPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard/order-management" element={<OrderManagement />} />
          <Route path="/dashboard/contactus" element={<DashboardContactUs />} />
          <Route path="/dashboard/catalog" element={<DashboardContactUs />} />
           <Route path="*" element={<Navigate to="/404" />} />

        </Routes>

      </Layout>
    </Router>
  );
}

export default App;