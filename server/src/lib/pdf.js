import PDFDocument from 'pdfkit';

const SEVERITY_LABEL = { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };

function addSectionTitle(doc, text) {
  doc.moveDown(1);
  doc.fontSize(15).fillColor('#111827').text(text, { underline: false });
  doc.moveTo(doc.x, doc.y + 2).lineTo(doc.page.width - doc.page.margins.right, doc.y + 2).strokeColor('#d1d5db').stroke();
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor('#1f2937');
}

export function renderAuditPdf(record, res) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  doc.pipe(res);

  doc.fontSize(20).fillColor('#111827').text('NexusAudit AI — Website Audit Report', { align: 'left' });
  doc.fontSize(11).fillColor('#4b5563').text(record.url, { align: 'left' });
  doc.text(`Generated: ${new Date(record.createdAt).toLocaleString()}`, { align: 'left' });

  doc.moveDown(1);
  doc.fontSize(36).fillColor('#111827').text(`${record.overall} / 100`, { align: 'left' });
  doc.fontSize(12).fillColor('#6b7280').text('Overall Score', { align: 'left' });

  addSectionTitle(doc, 'Category Scores');
  const cats = record.categories;
  const catLines = [
    ['Performance', cats.performance],
    ['SEO', cats.seo],
    ['Accessibility', cats.accessibility],
    ['Security', cats.security],
    ['Mobile', cats.mobile],
    ['Code Quality', cats.codeQuality],
  ];
  for (const [label, value] of catLines) {
    doc.fontSize(11).fillColor('#1f2937').text(`${label}: ${value}`, { continued: false });
  }

  if (record.ai) {
    addSectionTitle(doc, 'AI Summary');
    doc.fontSize(11).fillColor('#1f2937').text(record.ai.summary || 'Not available', { align: 'left' });

    if (record.ai.topProblems?.length) {
      addSectionTitle(doc, 'Critical Issues');
      for (const p of record.ai.topProblems) {
        doc.fontSize(12).fillColor('#111827').text(`[${SEVERITY_LABEL[p.severity] || p.severity?.toUpperCase()}] ${p.title}`);
        doc.fontSize(10).fillColor('#4b5563').text(p.explanation || '');
        doc.fontSize(10).fillColor('#065f46').text(`Fix: ${p.recommendation || ''}`);
        doc.moveDown(0.5);
      }
    }

    if (record.ai.priorities?.length) {
      addSectionTitle(doc, 'Recommendations');
      record.ai.priorities.forEach((p, i) => {
        doc.fontSize(11).fillColor('#1f2937').text(`${i + 1}. ${p}`);
      });
    }

    if (record.ai.strengths?.length) {
      addSectionTitle(doc, 'Strengths');
      record.ai.strengths.forEach((s) => {
        doc.fontSize(11).fillColor('#1f2937').text(`- ${s}`);
      });
    }
  }

  if (record.scan?.technologies?.length) {
    addSectionTitle(doc, 'Technology Detection');
    doc.fontSize(11).fillColor('#1f2937').text(record.scan.technologies.join(', '));
  }

  addSectionTitle(doc, 'Technical Findings');
  for (const issue of record.issues || []) {
    doc.fontSize(11).fillColor('#111827').text(`[${SEVERITY_LABEL[issue.severity] || issue.severity} · ${issue.category}] ${issue.title}`);
    doc.fontSize(9).fillColor('#4b5563').text(issue.explanation);
    doc.moveDown(0.3);
  }

  doc.end();
}
