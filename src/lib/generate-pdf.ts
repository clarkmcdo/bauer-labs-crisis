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

interface PlanItem {
  id: string;
  value?: string;
  name?: string;
  contact?: string;
  phone?: string;
}

// Make the DESCRIPTIONS keys match exactly what we'll look up
const DESCRIPTIONS: Record<string, string> = {
  'STEP 1: WARNING SIGNS': 'What thoughts, mood, or behavior might indicate a crisis is developing?',
  'STEP 2: INTERNAL COPING STRATEGIES': 'Things I can do to take my mind off my problems without contacting another person:',
  'STEP 3: PEOPLE AND SOCIAL SETTINGS': 'People and places that provide distraction and support:',
  'STEP 4: PEOPLE I CAN ASK FOR HELP': 'People I can reach out to when in crisis:',
  'STEP 5: PROFESSIONALS I CAN CONTACT': 'Professional resources and crisis hotlines:',
  'STEP 6: MAKING THE ENVIRONMENT SAFER': 'Steps to make my environment safer:'
};

export const generateSafetyPlanPDF = (data: SafetyPlanData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  
  // Add header with better spacing
  doc.setFontSize(24);
  doc.setTextColor(23, 85, 166); // Stanley-Brown blue
  doc.text('BAUER LABS SAFETY PLAN', pageWidth / 2, 20, { align: 'center' });
  
  // Helper function for sections with improved spacing
  const addSection = (title: string, y: number, items: PlanItem[], format?: string) => {
    // Section header
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(23, 85, 166);
    doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
    doc.text(title, margin + 2, y + 5);
    
    // Section description
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const description = DESCRIPTIONS[title] || ''; // Safe access with fallback
    doc.text(description, margin + 2, y + 12);
    
    // Section content with better spacing
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    let currentY = y + 18;
    items.forEach((item, idx) => {
      if (format === 'contact') {
        doc.text(`${idx + 1}. Name: ${item.name}`, margin + 2, currentY);
        doc.text(`   Contact: ${item.contact}`, margin + 2, currentY + 5);
        currentY += 12;
      } else if (format === 'professional') {
        doc.text(`${idx + 1}. Name: ${item.name}`, margin + 2, currentY);
        doc.text(`   Phone: ${item.phone}`, margin + 2, currentY + 5);
        currentY += 12;
      } else {
        doc.text(`${idx + 1}. ${item.value}`, margin + 2, currentY);
        currentY += 7;
      }
    });

    // Add crisis line for professionals section
    if (title.includes('PROFESSIONALS')) {
      doc.text('National Crisis Line: 1-800-273-8255 (TALK)', margin + 2, currentY + 3);
      currentY += 8;
    }
    
    return currentY + 5;
  };

  // Distribute sections evenly on the page
  let yPosition = 30;
  
  // Add sections
  const sections = [
    { title: 'STEP 1: WARNING SIGNS', data: data.warningSteps },
    { title: 'STEP 2: INTERNAL COPING STRATEGIES', data: data.copingStrategies },
    { title: 'STEP 3: PEOPLE AND SOCIAL SETTINGS', data: data.socialSettings },
    { title: 'STEP 4: PEOPLE I CAN ASK FOR HELP', data: data.supportContacts, format: 'contact' },
    { title: 'STEP 5: PROFESSIONALS I CAN CONTACT', data: data.professionals, format: 'professional' },
    { title: 'STEP 6: MAKING THE ENVIRONMENT SAFER', data: data.safetyMeasures }
  ];

  sections.forEach(section => {
    yPosition = addSection(section.title, yPosition, section.data, section.format);
  });
  
  // Add footer with better positioning
  const footerText = '© 2024 BAUER LABS Crisis Response Platform - Confidential Safety Plan';
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(footerText, pageWidth / 2, 280, { align: 'center' });

  return doc;
};
