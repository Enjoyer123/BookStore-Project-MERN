import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useState, useEffect,useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { fetchDataFromApi,deleteData } from "../../utils/api";
import { postData } from "../../utils/api";
import { MyContext } from '../../App';

const style = { "layout": "vertical" };

const PayPalButton = ({ totalAmount, info }) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const context = useContext(MyContext);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const history = useNavigate();

    const clearCart = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
    
        return fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((cartItems) => {
            const deletePromises = cartItems.map((item) => deleteData(`/api/cart/${item.id}`));
            return Promise.all(deletePromises); 
        }).then(() => {
            
            return fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((newCartData) => {
                context.setCartData(newCartData); 
            
            });
        });
    };
    

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    currency_code: "USD",
                    value: totalAmount, 
                },
            }],
        }).then((orderId) => {
            return orderId;
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            const shipping = details.purchase_units[0].shipping;

            let savedPayload = JSON.parse(sessionStorage.getItem("orderPayload"));
           
            if (savedPayload) {
                const paymentId = details.id;

                const updatedPayload = {
                    ...savedPayload,  
                    paymentId: paymentId 
                };

                postData("/api/orders/create", updatedPayload).then((res) => {
                   
                    return clearCart().then(() => {
                        history("/orders"); 
                    });
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            } else {
                console.error("No order payload found in sessionStorage");
            }
        });
    };

    return (
        <>
            {isPending && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[totalAmount, "USD", style]}
                fundingSource={undefined}
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </>
    );
};

const Checkout = ({ info, totalAmount }) => {
    return (
        <div style={{ maxWidth: "750px", minHeight: "200px" }}>
            <PayPalScriptProvider
                options={{
                    "client-id": "Your client-id Paypal",
                    
                    components: "buttons",
                    currency: "USD"
                }}>
                <PayPalButton info={info} totalAmount={totalAmount} />
            </PayPalScriptProvider>
        </div>
    );
};

export default Checkout;
