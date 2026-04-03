import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, BackHandler, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import OTPVerificationScreen from './src/screens/OTPVerificationScreen';
import HomeScreen from './src/screens/HomeScreen';
import SubCategoryScreen from './src/screens/SubCategoryScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import OrderDetailsScreen, { Order } from './src/screens/OrderDetailsScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import SavedAddressesScreen from './src/screens/SavedAddressesScreen';
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import TermsConditionsScreen from './src/screens/TermsConditionsScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderReceivedScreen from './src/screens/OrderReceivedScreen';
import OrderTrackingScreen from './src/screens/OrderTrackingScreen';
import RationKitsScreen from './src/screens/RationKitsScreen';
import TabBar, { TabName } from './src/components/TabBar';
import Toast from './src/components/Toast';
import { Product } from './src/data/categoryData';

type Screen = 'splash' | 'login' | 'otp' | 'home' | 'subCategory' | 'categories' | 'orders' | 'orderDetails' | 'cart' | 'profile' | 'search' | 'myOrders' | 'savedAddresses' | 'paymentMethods' | 'helpSupport' | 'privacyPolicy' | 'termsConditions' | 'productDetail' | 'checkout' | 'orderReceived' | 'orderTracking' | 'rationKits';

export default function App() {
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['splash']);
  const currentScreen = screenHistory[screenHistory.length - 1];

  const navigateTo = (screen: Screen) =>
    setScreenHistory((prev) => [...prev, screen]);

  const goBack = () =>
    setScreenHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setScreenHistory((prev) => {
        if (prev.length > 1) return prev.slice(0, -1);
        return prev; // let OS handle (exit) when at root
      });
      // Return true to prevent app exit when we have history
      return screenHistory.length > 1;
    });
    return () => sub.remove();
  }, [screenHistory]);

  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cartState, setCartState] = useState<Record<string, number>>({});

  // Screen transition animation
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(24);
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 200 }),
    ]).start();
  }, [currentScreen]);
  const addToCart = (productId: string) => {
    setCartState((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));
  };

  const removeFromCart = (productId: string) =>
    setCartState((prev) => {
      const qty = (prev[productId] ?? 0) - 1;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: qty };
    });

  const handleReorder = (order: Order) => {
    const newCartState: Record<string, number> = { ...cartState };
    order.items.forEach(item => {
      newCartState[item.id] = (newCartState[item.id] ?? 0) + item.quantity;
    });
    setCartState(newCartState);
    setScreenHistory(['cart']);
  };

  const getActiveTab = (): TabName => {
    if (currentScreen === 'categories') return 'categories';
    if (currentScreen === 'orders')     return 'orders';
    if (currentScreen === 'cart')       return 'cart';
    return 'home';
  };

  const showTabBar = ['home', 'subCategory', 'categories', 'orders', 'cart'].includes(currentScreen);

  const cartCount = Object.values(cartState).reduce((s, q) => s + q, 0);
  const showCartToast = cartCount > 0 && ['home', 'subCategory', 'categories', 'productDetail'].includes(currentScreen);

  const handleSplashFinish = () => {
    setScreenHistory(['login']);
  };

  const handleLoginSuccess = (phone: string) => {
    setPhoneNumber(phone);
    navigateTo('otp');
  };

  const handleOtpVerifySuccess = () => {
    setScreenHistory(['home']);
    console.log('User authenticated successfully!');
  };

  const handleGoBack = () => {
    goBack();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      case 'otp':
        return (
          <OTPVerificationScreen
            phoneNumber={phoneNumber}
            onVerifySuccess={handleOtpVerifySuccess}
            onGoBack={handleGoBack}
          />
        );
      case 'home':
        return (
          <HomeScreen
            onCategoryPress={(name) => {
              setSelectedCategory(name);
              navigateTo('subCategory');
            }}
            onSearchPress={() => navigateTo('search')}
            onProfilePress={() => navigateTo('profile')}
            onCartPress={() => navigateTo('cart')}
            onRationKitsPress={() => navigateTo('rationKits')}
            cartState={cartState}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
          />
        );
      case 'subCategory':
        return (
          <SubCategoryScreen
            categoryName={selectedCategory}
            onGoBack={goBack}
            onSearchPress={() => navigateTo('search')}
            onProductPress={(p) => { setSelectedProduct(p); navigateTo('productDetail'); }}
            cartState={cartState}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
          />
        );
      case 'categories':
        return (
          <CategoriesScreen
            onGoBack={goBack}
            onCategoryPress={(name) => {
              setSelectedCategory(name);
              navigateTo('subCategory');
            }}
          />
        );
      case 'orders':
        return (
          <OrdersScreen
            onGoBack={goBack}
            onOrderPress={(order) => {
              setSelectedOrder(order);
              navigateTo('orderDetails');
            }}
            onReorder={handleReorder}
          />
        );
      case 'orderDetails':
        return selectedOrder ? (
          <OrderDetailsScreen
            order={selectedOrder}
            onGoBack={goBack}
            onReorder={(items) => {
              handleReorder(selectedOrder);
            }}
          />
        ) : null;
      case 'cart':
        return (
          <CartScreen
            onGoBack={goBack}
            cartState={cartState}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onCheckout={(total) => { setCheckoutTotal(total); navigateTo('checkout'); }}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onGoBack={goBack}
            onNavigate={(screen) => navigateTo(screen as Screen)}
            onSignOut={() => setScreenHistory(['login'])}
          />
        );
      case 'myOrders':
        return <MyOrdersScreen onGoBack={goBack} />;
      case 'savedAddresses':
        return <SavedAddressesScreen onGoBack={goBack} />;
      case 'paymentMethods':
        return <PaymentMethodsScreen onGoBack={goBack} />;
      case 'helpSupport':
        return <HelpSupportScreen onGoBack={goBack} />;
      case 'privacyPolicy':
        return <PrivacyPolicyScreen onGoBack={goBack} />;
      case 'termsConditions':
        return <TermsConditionsScreen onGoBack={goBack} />;
      case 'productDetail':
        return selectedProduct ? (
          <ProductDetailScreen
            product={selectedProduct}
            categoryName={selectedCategory}
            cartState={cartState}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onGoBack={goBack}
          />
        ) : null;
      case 'checkout':
        return (
          <CheckoutScreen
            total={checkoutTotal}
            onGoBack={goBack}
            onOrderPlaced={(orderId) => {
              setCurrentOrderId(orderId);
              setCartState({});
              setScreenHistory((prev) => [...prev.filter(s => s !== 'cart' && s !== 'checkout'), 'orderReceived']);
            }}
          />
        );
      case 'orderReceived':
        return (
          <OrderReceivedScreen
            orderId={currentOrderId}
            total={checkoutTotal}
            onTrackOrder={() => navigateTo('orderTracking')}
            onContinueShopping={() => setScreenHistory(['home'])}
          />
        );
      case 'orderTracking':
        return (
          <OrderTrackingScreen
            orderId={currentOrderId}
            onGoBack={goBack}
            onContinueShopping={() => setScreenHistory(['home'])}
          />
        );
      case 'rationKits':
        return (
          <RationKitsScreen
            onGoBack={goBack}
            onAddKitToCart={(kit) => {
              const newCartState: Record<string, number> = { ...cartState };
              kit.items.forEach(item => {
                newCartState[item.id] = (newCartState[item.id] ?? 0) + 1;
              });
              setCartState(newCartState);
              navigateTo('cart');
            }}
          />
        );
      case 'search':
        return (
          <SearchScreen
            onGoBack={goBack}
            onCategoryPress={(name) => {
              setSelectedCategory(name);
              navigateTo('subCategory');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={appStyles.container}>
        <Animated.View
          style={[
            appStyles.screenWrapper,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {renderScreen()}
        </Animated.View>
        <Toast
          visible={showCartToast}
          cartCount={cartCount}
          onPress={() => navigateTo('cart')}
        />
        {showTabBar && (
          <TabBar
            activeTab={getActiveTab()}
            cartCount={cartCount}
            onTabPress={(tab) => {
              if (tab === 'home')            setScreenHistory(['home']);
              else if (tab === 'categories') setScreenHistory(['categories']);
              else if (tab === 'orders')     setScreenHistory(['orders']);
              else if (tab === 'cart')       setScreenHistory(['cart']);
            }}
          />
        )}
      </View>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
  },
});
