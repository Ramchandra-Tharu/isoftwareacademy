import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISetting extends Document {
  // General
  siteName: string;
  siteLogo: string;
  contactEmail: string;
  address: string;
  
  // Notifications
  enableEmailAlerts: boolean;
  enableInAppNotifications: boolean;

  // Security
  passwordMinLength: number;
  requireSpecialChars: boolean;
  twoFactorAuth: boolean;
  maintenanceMode: boolean;

  // Appearance
  theme: "dark" | "light" | "glass";
  primaryColor: string;
  accentColor: string;

  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    siteName: {
      type: String,
      default: "iSoftware Lab Academy",
    },
    siteLogo: {
      type: String,
      default: "/logo.png",
    },
    contactEmail: {
      type: String,
      default: "support@isoftwareacademy.com",
    },
    address: {
      type: String,
      default: "Tech Hub, Silicon Valley, CA",
    },
    enableEmailAlerts: {
      type: Boolean,
      default: true,
    },
    enableInAppNotifications: {
      type: Boolean,
      default: true,
    },
    passwordMinLength: {
      type: Number,
      default: 8,
    },
    requireSpecialChars: {
      type: Boolean,
      default: true,
    },
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      enum: ["dark", "light", "glass"],
      default: "glass",
    },
    primaryColor: {
      type: String,
      default: "#EBBB54",
    },
    accentColor: {
      type: String,
      default: "#ff4d4d",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);

export default Setting;
