function generateCertificate(team1, team2, score1, score2) {
  const canvas = document.createElement('canvas');
  canvas.width  = 800;
  canvas.height = 560;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#FFF8E1';
  ctx.fillRect(0, 0, 800, 560);

  // Outer border
  ctx.strokeStyle = '#F9A825';
  ctx.lineWidth = 12;
  ctx.strokeRect(10, 10, 780, 540);

  // Inner border
  ctx.strokeStyle = '#1565C0';
  ctx.lineWidth = 3;
  ctx.strokeRect(22, 22, 756, 516);

  // Decorative corners
  const corners = [[22,22],[778,22],[22,538],[778,538]];
  corners.forEach(([x, y]) => {
    ctx.fillStyle = '#F9A825';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // Title bar
  ctx.fillStyle = '#1565C0';
  ctx.fillRect(22, 22, 756, 70);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('TUG OF WAR: TAMIL LANGUAGE', 400, 65);

  // Certificate heading
  ctx.fillStyle = '#212121';
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillText('சாதனைச் சான்றிதழ்', 400, 130);
  ctx.font = 'italic 16px Georgia, serif';
  ctx.fillStyle = '#555';
  ctx.fillText('Certificate of Achievement', 400, 158);

  // Divider
  ctx.strokeStyle = '#F9A825';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 172); ctx.lineTo(720, 172);
  ctx.stroke();

  // Winner
  const winner = score1 > score2 ? team1 : score2 > score1 ? team2 : null;
  ctx.fillStyle = '#212121';
  ctx.font = '16px Arial';
  ctx.fillText('இந்த சான்றிதழ் வழங்கப்படுகிறது / This certificate is presented to', 400, 210);

  ctx.fillStyle = winner ? '#1565C0' : '#37474F';
  ctx.font = 'bold 36px Arial';
  ctx.fillText(winner ? winner : 'இரு குழுக்களும் (Draw)', 400, 265);

  if (winner) {
    ctx.fillStyle = '#C62828';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🏆 வெற்றியாளர்!', 400, 298);
  } else {
    ctx.fillStyle = '#37474F';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('சமநிலை!', 400, 298);
  }

  // Score display
  ctx.fillStyle = '#1565C0';
  ctx.fillRect(160, 320, 180, 80);
  ctx.fillStyle = '#C62828';
  ctx.fillRect(460, 320, 180, 80);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px Arial';
  ctx.fillText(team1, 250, 345);
  ctx.font = 'bold 38px Arial';
  ctx.fillText(score1, 250, 385);

  ctx.font = 'bold 14px Arial';
  ctx.fillText(team2, 550, 345);
  ctx.font = 'bold 38px Arial';
  ctx.fillText(score2, 550, 385);

  ctx.fillStyle = '#555';
  ctx.font = '13px Arial';
  ctx.fillText('VS', 400, 368);

  // Divider
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 420); ctx.lineTo(720, 420);
  ctx.stroke();

  // Date
  const now = new Date();
  const dateStr = now.toLocaleDateString('ta-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillStyle = '#757575';
  ctx.font = '14px Arial';
  ctx.fillText(dateStr, 400, 455);

  // Footer
  ctx.fillStyle = '#1565C0';
  ctx.font = 'bold 13px Arial';
  ctx.fillText('TUG OF WAR — Tamil Language Educational Game', 400, 510);

  return canvas;
}

function downloadCertificate(team1, team2, score1, score2) {
  const canvas = generateCertificate(team1, team2, score1, score2);
  const link = document.createElement('a');
  link.download = 'tow_certificate.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
