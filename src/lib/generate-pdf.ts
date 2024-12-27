// src/lib/generate-pdf.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface SafetyPlanData {
  warningSteps: Array<{ id: string; value: string }>;
  copingStrategies: Array<{ id: string; value: string }>;
  socialSettings: Array<{ id: string; value: string }>;
  supportContacts: Array<{ id: string; name: string; contact: string }>;
  professionals: Array<{ id: string; name: string; phone: string }>;
  safetyMeasures: Array<{ id: string; value: string }>;
}

const DESCRIPTIONS = {
  'WARNING SIGNS': 'What thoughts, mood, or behavior might indicate a crisis is developing?',
  'INTERNAL COPING STRATEGIES': 'Things I can do to take my mind off my problems without contacting another person:',
  'PEOPLE AND SOCIAL SETTINGS': 'People and places that provide distraction and support:',
  'PEOPLE I CAN ASK FOR HELP': 'People I can reach out to when in crisis:',
  'PROFESSIONALS I CAN CONTACT': 'Professional resources and crisis hotlines:',
  'MAKING THE ENVIRONMENT SAFER': 'Steps to make my environment safer:'
};

export const generateSafetyPlanPDF = (data: SafetyPlanData) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(28);
  doc.setTextColor(23, 85, 166); // Stanley-Brown blue
  doc.text('BAUER LABS SAFETY PLAN', doc.internal.pageSize.width / 2, 25, { align: 'center' });
  
  // Helper function for sections
  const addSection = (title: string, y: number, items: any[], format?: string) => {
    // Section header
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(23, 85, 166);
    doc.rect(14, y, doc.internal.pageSize.width - 28, 8, 'F');
    doc.text(title, 16, y + 6);
    
    // Section description
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    const description = DESCRIPTIONS[title.split(': ')[1]];
    doc.text(description, 20, y + 16);
    
    // Section content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let currentY = y + 24;
    items.forEach((item, index) => {
      if (format === 'contact') {
        doc.text(`${index + 1}. Name: ${item.name}`, 20, currentY);
        doc.text(`   Contact: ${item.contact}`, 20, currentY + 5);
        currentY += 12;
      } else if (format === 'professional') {
        doc.text(`${index + 1}. Name: ${item.name}`, 20, currentY);
        doc.text(`   Phone: ${item.phone}`, 20, currentY + 5);
        currentY += 12;
      } else {
        doc.text(`${index + 1}. ${item.value}`, 20, currentY);
        currentY += 8;
      }
    });

    // Add crisis line for professionals section
    if (title.includes('PROFESSIONALS')) {
      doc.text('National Crisis Line: 1-800-273-8255 (TALK)', 20, currentY + 5);
      currentY += 12;
    }
    
    return currentY + 8;
  };

  // Add all sections
  let yPosition = 35;
  
  yPosition = addSection('STEP 1: WARNING SIGNS', yPosition, data.warningSteps);
  yPosition = addSection('STEP 2: INTERNAL COPING STRATEGIES', yPosition, data.copingStrategies);
  yPosition = addSection('STEP 3: PEOPLE AND SOCIAL SETTINGS', yPosition, data.socialSettings);
  yPosition = addSection('STEP 4: PEOPLE I CAN ASK FOR HELP', yPosition, data.supportContacts, 'contact');
  yPosition = addSection('STEP 5: PROFESSIONALS I CAN CONTACT', yPosition, data.professionals, 'professional');
  yPosition = addSection('STEP 6: MAKING THE ENVIRONMENT SAFER', yPosition, data.safetyMeasures);

  // Add footer
  const footerText = '© 2024 BAUER LABS Crisis Response Platform - Confidential Safety Plan';
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(footerText, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });

  return doc;
};