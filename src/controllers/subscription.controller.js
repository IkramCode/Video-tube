import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  try {
    if (!channelId || !isValidObjectId(channelId)) {
      throw new ApiError(400, "Invalid channel ID");
    }
  
    const user = await User.findById(req.user._id);
  
    if (!user.trim() === "") {
      throw new ApiError(401, "Unauthorized User ID");
    }
  
    const isSubscribed = user.subscriptions.includes(channelId);
  
    if (isSubscribed) {
      user.subscriptions = user.subscriptions.filter(
        (sub) => sub.toString() !== channelId
      );
    } else {
      user.subscriptions.push(channelId);
    }
  
    await user.save();
  
    return res
      .status(200)
      .json(
        new ApiResponse(
          200, 
          {}, 
          isSubscribed ? "Unsubscribed" : "Subscribed"
      )
      );
  } catch (error) {
    throw new ApiError(500 , "Error in subscription", error);
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
