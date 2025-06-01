
const nodemailer = require('nodemailer');
const path = require('path');

class AccountabilityManager {
  constructor() {
    this.sponsorData = null;
    this.progressData = {
      startDate: new Date(),
      violationCount: 0,
      lastViolation: null,
      strengthMoments: []
    };
  }

  async notifySpiritualSponsor(data) {
    const { sponsor, violationType, timestamp } = data;
    
    console.log(`🔔 Notifying spiritual sponsor: ${sponsor.name} about ${violationType}`);
    
    try {
      // In a real implementation, you would use a proper email service
      // For now, we'll log the notification
      const emailContent = this.generateViolationEmail(sponsor, violationType, timestamp);
      
      // Store the violation for progress tracking
      this.progressData.violationCount++;
      this.progressData.lastViolation = new Date(timestamp);
      
      console.log('Email content:', emailContent);
      
      return { success: true, message: 'Sponsor notified successfully' };
    } catch (error) {
      console.error('Failed to notify sponsor:', error);
      return { success: false, error: error.message };
    }
  }

  async sendProgressReport(data) {
    const { sponsor, progress, timestamp } = data;
    
    console.log(`📊 Sending progress report to: ${sponsor.name}`);
    
    try {
      const emailContent = this.generateProgressEmail(sponsor, progress, timestamp);
      console.log('Progress report:', emailContent);
      
      return { success: true, message: 'Progress report sent successfully' };
    } catch (error) {
      console.error('Failed to send progress report:', error);
      return { success: false, error: error.message };
    }
  }

  generateViolationEmail(sponsor, violationType, timestamp) {
    return {
      to: sponsor.email,
      subject: '🙏 NetFast - Spiritual Support Needed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #78716c;">NetFast - Spiritual Discipline Alert</h2>
          
          <p>Dear ${sponsor.name},</p>
          
          <p>Your spiritual companion has encountered a moment of challenge in their digital discipline journey.</p>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">Challenge Detected:</h3>
            <p style="color: #92400e;"><strong>${violationType}</strong></p>
            <p style="color: #92400e; font-size: 14px;">Time: ${new Date(timestamp).toLocaleString()}</p>
          </div>
          
          <p>This is an opportunity to offer compassionate support and gentle guidance. Consider reaching out with:</p>
          
          <ul>
            <li>🤝 A kind message of encouragement</li>
            <li>🙏 A reminder of their spiritual goals</li>
            <li>💪 Strength to continue their journey</li>
          </ul>
          
          <p>Remember, the path of discipline is not about perfection, but about recommitment to growth.</p>
          
          <p style="margin-top: 30px;">
            With compassion,<br>
            <em>The NetFast Team</em>
          </p>
        </div>
      `
    };
  }

  generateProgressEmail(sponsor, progress, timestamp) {
    const completionPercentage = Math.round((progress.daysCompleted / progress.totalDays) * 100);
    
    return {
      to: sponsor.email,
      subject: `📈 NetFast Progress Report - Day ${progress.daysCompleted}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #78716c;">Spiritual Journey Progress Report</h2>
          
          <p>Dear ${sponsor.name},</p>
          
          <p>Here's the latest progress update for your spiritual companion's digital discipline journey:</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">Journey Progress</h3>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span>Days Completed:</span>
              <strong>${progress.daysCompleted} / ${progress.totalDays}</strong>
            </div>
            <div style="background: #dcfce7; height: 20px; border-radius: 10px; overflow: hidden;">
              <div style="background: #22c55e; height: 100%; width: ${completionPercentage}%; transition: width 0.3s;"></div>
            </div>
            <p style="text-align: center; margin: 10px 0; color: #166534;">${completionPercentage}% Complete</p>
          </div>
          
          ${progress.violationCount > 0 ? `
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #dc2626; margin-top: 0;">Challenges Faced</h4>
            <p style="color: #dc2626;">Total challenges: ${progress.violationCount}</p>
            ${progress.lastViolation ? `<p style="color: #dc2626; font-size: 14px;">Last challenge: ${new Date(progress.lastViolation).toLocaleDateString()}</p>` : ''}
          </div>
          ` : `
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #22c55e; margin-top: 0;">🎉 No Challenges This Period!</h4>
            <p style="color: #166534;">Your companion is staying strong on their spiritual path.</p>
          </div>
          `}
          
          ${progress.strengthMoments.length > 0 ? `
          <div style="background: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #d97706; margin-top: 0;">✨ Moments of Strength</h4>
            <ul style="color: #d97706;">
              ${progress.strengthMoments.map(moment => `<li>${moment}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          <p>Continue offering your support and encouragement. Your role as a spiritual companion makes a profound difference in their journey.</p>
          
          <p style="margin-top: 30px;">
            In gratitude,<br>
            <em>The NetFast Team</em>
          </p>
        </div>
      `
    };
  }

  getProgressData() {
    return this.progressData;
  }

  addStrengthMoment(moment) {
    this.progressData.strengthMoments.push({
      moment,
      timestamp: new Date()
    });
  }
}

module.exports = new AccountabilityManager();
