const Batchmate = require('../models/Batchmate.js');
const PDFDocument = require('pdfkit');

/**
 * @desc    Download Batchmate profile as PDF using enterpriseid
 * @route   GET /api/batchmates/download/:enterpriseid
 * @access  Private (use auth middleware if needed)
 */
exports.downloadBatchmateProfilePDF = async (req, res) => {
  try {
    const { enterpriseid } = req.params;

    // Find batchmate by enterpriseid
    const user = await Batchmate.findOne({ enterpriseid }).select('-otp');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set headers for PDF download
    res.setHeader('Content-Disposition', `attachment; filename=batchmate-${enterpriseid}-profile.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    // Create PDF document
    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    doc.fontSize(20).text('DU Profile', { align: 'center' }).moveDown();

    // Dynamically write each key-value pair
    const excludedFields = ['otp', '__v', '_id'];
    Object.entries(user.toObject()).forEach(([key, value]) => {
      if (!excludedFields.includes(key) && value) {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        doc.fontSize(12).text(`${formattedKey}: ${value}`);
      }
    });

    doc.end(); // Finalize PDF
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Server error while generating profile PDF' });
  }
};
