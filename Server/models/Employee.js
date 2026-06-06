import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'intern', 'temporary'],
    default: 'full-time'
  },
  workLocation: {
    type: String,
    default: ''
  },
  reportingManager: {
    type: String,
    default: ''
  },
  joiningDate: {
    type: Date,
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['', 'male', 'female', 'other', 'prefer-not-to-say'],
    default: ''
  },
  maritalStatus: {
    type: String,
    enum: ['', 'single', 'married', 'divorced', 'widowed'],
    default: ''
  },
  phone: {
    type: String,
    required: true
  },
  alternatePhone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  postalCode: {
    type: String,
    default: ''
  },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    panNumber: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  leaveBalance: {
    annual: { type: Number, default: 12 },
    sick: { type: Number, default: 6 },
    casual: { type: Number, default: 6 }
  }
}, {
  timestamps: true
});

export default mongoose.model("Employee", employeeSchema);
