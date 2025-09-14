const canvas = new fabric.Canvas('scrapbook-canvas', {
  isDrawingMode: false
});

// Default pencil
canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
canvas.freeDrawingBrush.color = "#000000";
canvas.freeDrawingBrush.width = 5;

// Pencil tool
document.getElementById('draw-btn').onclick = () => {
  canvas.isDrawingMode = true;
};

// Brush color
document.getElementById('color-picker').oninput = e => {
  canvas.freeDrawingBrush.color = e.target.value;
};

// Brush size
document.getElementById('brush-size').oninput = e => {
  canvas.freeDrawingBrush.width = parseInt(e.target.value, 10) || 1;
};

// Clear all (except background)
document.getElementById('clear-btn').onclick = () => {
  const bg = canvas.backgroundImage;
  canvas.clear();
  canvas.setBackgroundImage(bg, canvas.renderAll.bind(canvas));
};

// Stickers fix
document.querySelectorAll('.sticker').forEach(img => {
  img.addEventListener('dragstart', e => {
    e.dataTransfer.setData('src', e.target.src);
  });
});

canvas.upperCanvasEl.addEventListener('dragover', e => e.preventDefault());

canvas.upperCanvasEl.addEventListener('drop', e => {
  e.preventDefault();
  const src = e.dataTransfer.getData('src');
  if (src) {
    fabric.Image.fromURL(src, img => {
      img.set({
        left: e.offsetX,
        top: e.offsetY,
        selectable: true
      });
      img.scaleToWidth(120);
      canvas.add(img);
    });
  }
});

// Add text
document.getElementById('text-btn').onclick = () => {
  canvas.isDrawingMode = false;
  const text = new fabric.IText('Your text here', {
    left: 100, top: 100,
    fontFamily: 'Comic Sans MS',
    fill: document.getElementById('color-picker').value,
    fontSize: 24
  });
  canvas.add(text);
  canvas.setActiveObject(text);
};

// Upload image
document.getElementById('image-upload').onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = f => {
    fabric.Image.fromURL(f.target.result, img => {
      img.scaleToWidth(200);
      canvas.add(img);
    });
  };
  reader.readAsDataURL(file);
};

// Delete selected
document.getElementById('delete-btn').onclick = () => {
  const active = canvas.getActiveObject();
  if (active) canvas.remove(active);
};

// Background image
fabric.Image.fromURL('./assets/scrapbook-bg.png', img => {
  canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
    scaleX: canvas.width / img.width,
    scaleY: canvas.height / img.height
  });
});
