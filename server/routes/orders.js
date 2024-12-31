const { Orders } = require('../models/orders');
const express = require('express');
const router = express.Router();
const { Product } = require('../models/products');



router.get(`/`, async (req, res) => {

    try {
    

        const ordersList = await Orders.find(
         
        )


        if (!ordersList) {
            res.status(500).json({ success: false })
        }

        return res.status(200).json({
          "orders":ordersList
        });

    } catch (error) {
        res.status(500).json({ success: false })
    }


});


router.get(`/own`, async (req, res) => {

  try {
  

      const ordersList = await Orders.find(
        {

          userid: req.query.userid
        }

       
      )


      if (!ordersList) {
          res.status(500).json({ success: false })
      }

      return res.status(200).json(ordersList);

  } catch (error) {
      res.status(500).json({ success: false })
  }


});



router.get(`/pending`, async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1; 
      const perPage = 10;
      const totalPosts = await Orders.countDocuments({ status: "pending" });
      const totalPages = Math.ceil(totalPosts / perPage)

    

      if (page > totalPages) {
          return res.status(404).json({ message: "No data found!" });
      }

      const ordersList = await Orders.find({ status: "pending" })
          .skip((page - 1) * perPage)
          .limit(perPage)
          .exec();

          return res.status(200).json({
            "orders":ordersList,
           "totalPages": totalPages,
           "page": page
        });

  } catch (error) {
      res.status(500).json({ success: false });
  }
});

router.get(`/complete`, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const perPage = 10;
    const totalPosts = await Orders.countDocuments({ status: "confirm" });
    const totalPages = Math.ceil(totalPosts / perPage)

      if (page > totalPages) {
          return res.status(404).json({ message: "No data found!" });
      }

      const ordersList = await Orders.find({ status: "confirm" })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

      return res.status(200).json({
        "orders":ordersList,
         "totalPages": totalPages,
         "page": page
      });

  } catch (error) {
      res.status(500).json({ success: false });
  }
});


router.get('/monthly-sales', async (req, res) => {
  try {
  
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    
    
    const monthlySales = await Orders.aggregate([
      {
        $match: {
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: null, 
          totalSales: { $sum: "$amount" } 
        }
      }
    ]);

    
    res.status(200).json({
      monthlySales: monthlySales.length ? monthlySales[0].totalSales : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/total-orders', async (req, res) => {
  try {
    // สร้างวันที่เริ่มต้นของเดือนปัจจุบัน
    const startOfMonth = new Date();
    startOfMonth.setDate(1); 

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1); 
    endOfMonth.setDate(0); 

    
    const totalOrders = await Orders.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

 
    res.status(200).json({
      totalOrders: totalOrders 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/daily-sales', async (req, res) => {
  try {
    const salesData = await Orders.aggregate([
      {
        $unwind: "$products" 
      },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
            subcat: "$products.subCatName" 
          },
          totalSales: { $sum: "$products.subTotal" } 
        }
      },
      {
        $sort: { "_id.date": 1, "_id.subCatName": 1 } 
      }
    ]);


    const formattedSalesData = salesData.map(sale => ({
      date: sale._id.date,       
      subCatName: sale._id.subCatName, 
      totalSales: sale.totalSales 
    }));

    
    res.status(200).json({
      success: true,
      data: formattedSalesData 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching'
    });
  }
});


router.get('/daily-subcat-quantity', async (req, res) => {
  try {
    const quantityData = await Orders.aggregate([
      {
          $unwind: "$products" 
      },
      {
          $group: {
              _id: {
                  date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
                  subcat: "$products.subCatName" 
              },
              totalSales: { $sum: 1 } 
          }
      },
      {
          $project: {
              _id: 0, 
              date: "$_id.date", 
              subcat: "$_id.subcat", 
              totalSales: 1 
          }
      },
      {
          $sort: { date: 1, subcat: 1 } 
      }
  ]);
  
   
    res.status(200).json(quantityData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching'
    });
  }
});


  
router.get('/all-monthly-sales', async (req, res) => {
  try {
    const monthlySales = await Orders.aggregate([
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } }, 
          },
          totalSales: { $sum: "$amount" } 
        }
      },
      {
        $project: {
          _id: 0, 
          month: "$_id.month", 
          totalSales: 1 
        }
      },
      {
        $sort: { month: 1 } 
      }
    ]);

    res.status(200).json(monthlySales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


  router.get('/customer-sales', async (req, res) => {
    try {
      const salesData = await Orders.aggregate([
        {
          $group: {
            _id: {
              name: "$name",
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
            },
            totalAmount: { $sum: "$amount" } 
          }
        },
        {
          $project: {
            _id: 0,
            name: "$_id.name",
            date: "$_id.date",
            totalAmount: 1
          }
        },
        {
          $sort: { date: 1, name: 1 } 
        }
      ]);
  
      res.status(200).json({
        success: true,
        data: salesData 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'error'
      });
    }
  });
  



router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
       
        const order = await Orders.findById(id); 

       
        return res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the order.' });
    }
});

module.exports = router;


router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Orders.countDocuments()

    if(!orderCount) {
        res.status(500).json({success: false})
    } else{
        res.send({
            orderCount: orderCount
        });
    }
   
})



router.post('/create', async (req, res) => {

    let order = new Orders({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        pincode: req.body.pincode,
        amount: req.body.amount,
        paymentId: req.body.paymentId,
        email: req.body.email,
        userid: req.body.userid,
        products: req.body.products,
    });



    if (!order) {
        res.status(500).json({
            error: err,
            success: false
        })
    }


    order = await order.save();


    res.status(201).json(order);

});


router.delete('/:id', async (req, res) => {

    const deletedOrder = await Orders.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
        res.status(404).json({
            message: 'Order not found!',
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: 'Order Deleted!'
    })
});


router.put('/:id', async (req, res) => {

    const order = await Orders.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            pincode: req.body.pincode,
            amount: req.body.amount,
            paymentId: req.body.paymentId,
            email: req.body.email,
            userid: req.body.userid,
            products: req.body.products,
            status:req.body.status
        },
        { new: true }
    )



    if (!order) {
        return res.status(500).json({
            message: 'Order cannot be updated!',
            success: false
        })
    }

    res.send(order);

})



module.exports = router;

