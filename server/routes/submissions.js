const express = require('express');
const router = express.Router();
const { z } = require('zod');
const Submission = require('../models/Submission');
const requireAuth = require('../middleware/requireAuth');
const upload = require('../middleware/upload');
const optimizeImages = require('../middleware/imageOptimizer');
const imagekit = require('../config/imagekit');
const nodemailer = require('nodemailer');

const submissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email is required"),
  vehicle: z.string().min(1, "Vehicle is required"),
  serviceNeeded: z.string().min(1, "Service is required"),
  message: z.string().optional(),
});

// @route   POST /api/submissions
// @desc    Submit a new contact/quote form (Public)
router.post('/', upload.array('photos', 5), optimizeImages, async (req, res) => {
  try {
    const validatedData = submissionSchema.parse(req.body);
    
    // Process photos if any
    const photos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          return res.status(400).json({ error: 'File size exceeds 10MB limit' });
        }
        const uploadResponse = await imagekit.files.upload({
          file: file.buffer.toString('base64'),
          fileName: `submission_${Date.now()}_${file.originalname}`,
          folder: '/clarity_auto_spa/submissions',
        });
        photos.push({ url: uploadResponse.url, id: uploadResponse.fileId });
      }
    }

    const submission = new Submission({
      ...validatedData,
      photos,
      miniDetailAcknowledged: req.body.miniDetailAcknowledged === 'true'
    });
    
    await submission.save();

    // Send emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'clarityautospabk@gmail.com',
        pass: process.env.EMAIL_PASS || 'password', // mock
      }
    });

    const mailToShop = {
      from: process.env.EMAIL_USER || 'clarityautospabk@gmail.com',
      to: 'clarityautospabk@gmail.com',
      subject: `New Quote Request from ${submission.name}`,
      text: `Name: ${submission.name}\nPhone: ${submission.phone}\nEmail: ${submission.email}\nVehicle: ${submission.vehicle}\nService: ${submission.serviceNeeded}\nMessage: ${submission.message || 'N/A'}\nMini Detail Acknowledged: ${submission.miniDetailAcknowledged ? 'Yes' : 'N/A'}\nPhotos attached: ${photos.length}`,
    };

    const mailToCustomer = {
      from: process.env.EMAIL_USER || 'clarityautospabk@gmail.com',
      to: submission.email,
      subject: 'Clarity Auto Spa - Quote Request Received',
      text: `Hi ${submission.name},\n\nWe have received your quote request for your ${submission.vehicle}. Our team will review the details and get back to you shortly.\n\nThank you,\nClarity Auto Spa`,
    };

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailToShop);
        await transporter.sendMail(mailToCustomer);
      } else {
        console.log("Email env vars not set, skipping actual email send.");
      }
    } catch (err) {
      console.error("Email send failed", err);
    }

    res.status(201).json({ message: "Submission received successfully", submission });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.errors });
    }
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET /api/submissions
// @desc    Get all submissions (Admin)
router.get('/', requireAuth, async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   DELETE /api/submissions/:id
// @desc    Delete a submission (Admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    
    // delete images
    for (const photo of submission.photos) {
      if (photo.id) await imagekit.files.delete(photo.id).catch(() => {});
    }

    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
