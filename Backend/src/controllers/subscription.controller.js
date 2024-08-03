import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  try {
    const subscription = await Subscription.findOne({
      subscriber: user._id,
      channel: channelId,
    });

    if (!subscription) {
      await Subscription.create({
        subscriber: user._id,
        channel: channelId,
      });
    } else {
      await subscription.deleteOne();
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscription ? "Unsubscribed successfully" : "Subscribed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "An error occurred while toggling subscription");
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  try {
    const subscribers = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscriber",
        },
      },
      {
        $unwind: "$subscriber",
      },
    ]);

    const subscribersCount = subscribers.length;
    const subscribersList = subscribers.map((subscriber) => {
      return subscriber.subscriber;
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          subscribersList,
          subscribersCount,
        },
        "Subscribers fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "An error occurred while fetching subscribers");
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  try {
    const subscribedChannels = await Subscription.aggregate([
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(subscriberId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channel",
        },
      },
      {
        $unwind: "$channel",
      },
    ]);

    const channelsCount = subscribedChannels.length;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          subscribedChannels,
          channelsCount,
        },
        "Channels fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "An error occurred while fetching channels");
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
