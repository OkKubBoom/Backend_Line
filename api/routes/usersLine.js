var express = require('express');
var router = express.Router();
var User = require('../models/UserLineModel'); 
var ResponseModel = require('../models/ResponseModel');
require('dotenv').config();
const LINE_ACCESS_TOKEN = process.env.YOUR_LINE_CHANNEL_ACCESS_TOKEN;
const RICH_MENU_PASS_REGISTERED = "richmenu-d980ac56d4ce3ff9b0996cfbdd9370fb"; // 1
const RICH_MENU_DEFAULT = "richmenu-6ebd2030af3d790facdda37d89a88d2a"; // 2
const axios = require("axios");
router.get('/', async (req, res, next) => {
    try {
        const users = await User.find(); 
        console.log('Data fetched successfully!');
        res.status(200).json(new ResponseModel(200, true, 'successful',users,null));
        
    } 
    catch (err) {
        console.error('Error fetching data:', err); 
        res.status(501).json(new ResponseModel(501, false, 'error',null,err));
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findOne({ user_line }); 
        if (!user) {
            res.status(501).json(new ResponseModel(501, false, 'User not found',user,null));
        }
        res.status(200).json(new ResponseModel(200, true, 'successful',user,null));
    } catch (err) {
        res.status(501).json(new ResponseModel(501, false, 'error',null,err));
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { user_line } = req.body;
        if (!user_line) {
            return res.status(501).json(new ResponseModel(400, false, 'Not Have Line ID'));
        }
        const user = await User.findOne({ user_line });
        
        if (user) {
            return res.status(501).json(new ResponseModel(400, false, 'The Line ID is already in use.'));
        }

        const newUser = await User.create({
            user_line
        });

        return res.status(200).json(new ResponseModel(200, true, 'User Line created successfully', newUser));
    } catch (err) {
        console.error('Error during user creation:', err);
        res.status(500).json(new ResponseModel(500, false, 'Server error', null, err));
    }
});


router.put('/:id', async (req, res, next) => {
    try {
        const updatedUser = await User.findOneAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            res.status(500).json(new ResponseModel(500, false, 'User not found',user,null));
        }
        return res.status(200).json(new ResponseModel(200, true, 'User updated successfully', updatedUser));
    } catch (err) {
        res.status(500).json(new ResponseModel(500, false, 'error',null,err));
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedUser = await User.findOneAndDelete(req.params.id); 
        if (!deletedUser) {
            res.status(501).json(new ResponseModel(500, false, 'User not found',user,null));
        }
        return res.status(200).json(new ResponseModel(200, true, 'User deleted successfully',deletedUser,null));

    } catch (err) {
        res.status(500).json(new ResponseModel(500, false, 'error',null,err));
    }
});


router.post('/webhook', async (req, res, next) => {
    console.log("Received Webhook:", JSON.stringify(req.body, null, 2));
    try {
        const events = req.body.events;
        for (const event of events) {
            if (event.type === "follow") {
              const user_line = event.source.userId;
              console.log(`User ${user_line} followed the bot!`);
              const user = await User.findOne({ user_line });
              if(user) {
                console.log('================Start======================');
                console.log('RICH_MENU_PASS_REGISTERED');
                console.log('=================Ent=======================');
                    await linkRichMenu(user_line, RICH_MENU_PASS_REGISTERED);
                }else{
                console.log('================Start======================');
                console.log('RICH_MENU_DEFAULT');
                console.log('=================Ent=======================');
                    await linkRichMenu(user_line, RICH_MENU_DEFAULT);
                }  
        
              console.log("✅ User Line Webhook successfully");
              return res.status(200).json(new ResponseModel(200, true, 'User Line Webhook successfully'));                                             
            }
          }
    } catch (err) {
        console.error('❌ Error webhook:', err);
        res.status(500).json(new ResponseModel(500, false, 'Server webhook error', null, err));
    }
});
async function linkRichMenu(userId, richMenuId) {
    console.log('====================Start========================');
    console.log('LINE_ACCESS_TOKEN :',LINE_ACCESS_TOKEN);
    console.log('====================Ent========================');
    try {
        const url = `https://api.line.me/v2/bot/user/${userId}/richmenu/${richMenuId}`
        
    console.log('====================Start========================');
    console.log('URL :',url);
    console.log('====================Ent========================');

    console.log('============================================');
    console.log('LINE_ACCESS_TOKEN :',LINE_ACCESS_TOKEN);
    console.log('============================================');
      await axios.post(
        `https://api.line.me/v2/bot/user/${userId}/richmenu/${richMenuId}`,
        {},
        {
          headers: {
            Authorization: `Bearer TF8YhYwNEKULKMQN2+ilFe6ynBosjlGx0jFmUh6elNMqiamf6uP2rO5fOvrXXRSGT/adXnACLBZzdm///7DjJpJemIFzJmL7z4u7KhhnuOeWGilGNaMWLvRV0LDC7F5+V9w/y6y/oUsG6i07PbcDcQdB04t89/1O/w1cDnyilFU=`,
          },
        }
      );
      console.log('================Start======================');
      console.log(`✅ Rich Menu ${richMenuId} linked for user ${userId}`);
      console.log('=================Ent=======================');
    } catch (error) {
      console.log('================Start Error======================');
      console.error(`❌ Failed to link Rich Menu: ${error.message}`);
      console.log('=================Ent Error=======================');

    }
  }

module.exports = router;
