import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';

const Checkout = () => {
  const history = useNavigate();

  const [formFields, setFormFields] = useState({
    fullName: "",
    streetAddressLine1: "",
    streetAddressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: ""
  })
  const [showPayPal, setShowPayPal] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [info, setInfo] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    pincode: '',
    amount: 0,
    products: []
  });

  useEffect(() => {
    window.scrollTo(0, 0)
    const user = JSON.parse(sessionStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);

      setTotalAmount(res.length !== 0 &&
        res.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0))
    })

  }, []);



  const handleCheckout = (e) => {
    e.preventDefault();
    checkout();
  };

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value
    }))

  }

  const context = useContext(MyContext);

  const checkout = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const zipCodePattern = /^\d{5}$/;  
    const phonePattern = /^\d{10,15}$/; 
    const namePattern = /^[a-zA-Z\s]{2,50}$/; 
    const cityStatePattern = /^[a-zA-Z\s]{2,50}$/; 
    if (!namePattern.test(formFields.fullName)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please enter a valid full name (2-50 characters)"
      });
      return;
    }
    if (!emailPattern.test(formFields.email)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please enter a valid email address"
      });
      return;
    }

    if (!zipCodePattern.test(formFields.zipCode)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please enter a valid ZIP code"
      });
      return;
    }

    if (!phonePattern.test(formFields.phoneNumber)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please enter a valid phone number"
      });
      return;
    }

    if (!cityStatePattern.test(formFields.city)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please enter a valid city name (2-50 characters)"
      });
      return;
    }

    if (!cityStatePattern.test(formFields.state)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please enter a valid state name (2-50 characters)"
      });
      return;
    }

    if (!formFields.fullName || !formFields.streetAddressLine1 ||
      !formFields.state || !formFields.zipCode || !formFields.city ||
      !formFields.phoneNumber || !formFields.email) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all required fields"
      });
      return;
    }

    const user = JSON.parse(sessionStorage.getItem("user"));
    let payLoad = {
      name: formFields.fullName,
      phoneNumber: formFields.phoneNumber,
      address: `${formFields.city} ${formFields.state} ${formFields.streetAddressLine1} ${formFields.streetAddressLine2}`,
      pincode: formFields.zipCode,
      amount: totalAmount,
      email: user.email,
      userid: user.userId,
      products: cartData
    };

    sessionStorage.setItem("orderPayload", JSON.stringify(payLoad));


    setShowPayPal(true);
  };

  return (
    <section className='section'>

      <div className='container'>
      
        <form className='checkoutForm' onSubmit={checkout}>
          <div className='row'>
            <div className='col-md-9'>
              <h2 className='hd'>BILLING DETAILS</h2>

              <div className='row mt-3'>
                <div className='col-md-12 mb-2'>
                  <div className='form-group'>

                    <input
                      type="text"
                      className='w-100'
                      name="fullName"
                      required
                      pattern="^[a-zA-Z\s]{2,50}$"
                      onChange={onChangeInput}
                      placeholder='Full Name *'
                    />
                  </div>
                </div>
              </div>


              <div className='row'>
                <div className='col-md-12'>
                  <div className='form-group mb-2'>

                    <input
                      type="text"
                      placeholder='House number and street name'
                      className='w-100'
                      name="streetAddressLine1"
                      required
                      onChange={onChangeInput}
                    />
                  </div>
                  <div className='form-group mb-2'>

                    <input
                      type="text"
                      className='w-100'
                      placeholder='Apartment, suite, unit, etc. (optional)'
                      name="streetAddressLine2"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>


              <div className='row'>
                <div className='col-md-12'>
                  <div className='form-group mb-2'>

                    <input
                      type="text"
                      placeholder='Town / City *'
                      className='w-100'
                      name="city"
                      required
                      pattern="^[a-zA-Z\s]{2,50}$"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>


              <div className='row'>
                <div className='col-md-4 mb-2'>
                  <div className='form-group'>

                    <input
                      placeholder='State / County *'
                      type="text"
                      className='w-100'
                      name="state"
                      required
                      pattern="^[a-zA-Z\s]{2,50}$"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>

                <div className='col-md-4 mb-2'>
                  <div className='form-group'>

                    <input
                      type="text"
                      placeholder='Postcode / ZIP *'
                      className='w-100'
                      name="zipCode"
                      required
                      pattern="^\d{5}$"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>

                <div className='col-md-4 mb-2'>
                  <div className='form-group'>

                    <input
                      type="tel"
                      className='w-100'
                      name="phoneNumber"
                      placeholder='Phone Number'
                      required
                      pattern="^\d{10,15}$"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>


              <div className='row'>
                <div className='col-md-12 mb-3'>
                  <div className='form-group'>

                    <input
                      type="email"
                      className='w-100'
                      name="email"
                      placeholder='Email Address'
                      required
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='col-md-3'>
              <div className='card orderInfo p-3'>
                <h4 className='hd d-flex justify-content-center'>YOUR ORDER</h4>
                <div className='table-responsive mt-3'>
                  <table className='table table-borderless'>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartData?.length !== 0 && cartData?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.productTitle?.substr(0, 20) + '...'} <b>× {item?.quantity}</b></td>
                          <td>
                            {item?.subTotal?.toLocaleString('th-TH', {
                              style: 'currency',
                              currency: 'THB'
                            })}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>Subtotal</td>
                        <td>
                          {(cartData?.length !== 0) && cartData?.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0).toLocaleString('th-TH', {
                            style: 'currency',
                            currency: 'THB'
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>{totalAmount?.toLocaleString('th-TH', {
                          style: 'currency',
                          currency: 'THB'
                        })}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='d-flex justify-content-center'>


                    {!showPayPal ? (
                      <Button type="button" className='btn-blue bg-red btn-lg btn-big ' onClick={handleCheckout}>
                        Checkout
                      </Button>
                    ) : (
                      <PayPalButton totalAmount={totalAmount} formFields={formFields} cartData={cartData} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

      </div >
    </section >
  );
}

export default Checkout;
