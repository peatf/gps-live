// src/components/DiagnosticFlow.js
import React, { useEffect, useRef } from 'react';

const DiagnosticFlow = () => {
  const containerRef = useRef(null);
  const signalRef = useRef({ x: 50, y: 200 });
  const tracePoints = useRef([]);
  
  const nodes = [
    { x: 50, y: 200, symbol: '☁︎', symbolOffset: { x: -20, y: -20 } },
    { x: 200, y: 150, symbol: '꩜', symbolOffset: { x: 15, y: -25 } },
    { x: 350, y: 220, symbol: '𓆟', symbolOffset: { x: -20, y: 20 } },
    { x: 500, y: 180, symbol: '• • ☆*ೃ', symbolOffset: { x: 10, y: -20 } }
  ];

  useEffect(() => {
    const canvas = containerRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let time = 0;

    const drawNode = (x, y, isActive) => {
      ctx.beginPath();
      ctx.strokeStyle = isActive ? '#3E54B8' : 'rgba(62, 84, 184, 0.6)';
      ctx.lineWidth = 2;
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.stroke();

      if (isActive) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(62, 84, 184, 0.3)';
        ctx.arc(x, y, 4 + Math.sin(time * 0.1) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const getNextNodeIndex = (x) => {
      for (let i = 0; i < nodes.length; i++) {
        if (x <= nodes[i].x) return i;
      }
      return nodes.length - 1;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;
      
      // Draw grid with slight movement
      ctx.strokeStyle = 'rgba(74, 82, 74, 0.1)';
      ctx.lineWidth = 0.5;
      const offset = Math.sin(time * 0.02) * 2;
      for(let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i + offset, 0);
        ctx.lineTo(i + offset, canvas.height);
        ctx.stroke();
      }
      for(let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i - offset);
        ctx.lineTo(canvas.width, i - offset);
        ctx.stroke();
      }

      // Draw connection lines
      ctx.strokeStyle = 'rgba(74, 82, 74, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      for(let i = 1; i < nodes.length; i++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i-1].x, nodes[i-1].y);
        ctx.lineTo(nodes[i].x, nodes[i].y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw nodes and symbols
      ctx.font = '20px Arial';
      ctx.fillStyle = 'rgba(62, 84, 184, 0.6)';
      nodes.forEach((node, i) => {
        const isActive = signalRef.current.x >= node.x - 10 && signalRef.current.x <= node.x + 10;
        drawNode(node.x, node.y, isActive);
        
        const symbolY = node.y + node.symbolOffset.y + Math.sin(time * 0.05 + i) * 3;
        ctx.fillText(
          node.symbol, 
          node.x + node.symbolOffset.x,
          symbolY
        );

        ctx.strokeStyle = 'rgba(62, 84, 184, 0.2)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(node.x, node.y - 20);
        ctx.lineTo(node.x, node.y + 20);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw signal trace
      if (tracePoints.current.length > 0) {
        ctx.beginPath();
        ctx.strokeStyle = '#3E54B8';
        ctx.lineWidth = 2;
        ctx.moveTo(tracePoints.current[0].x, tracePoints.current[0].y);
        for(let i = 1; i < tracePoints.current.length; i++) {
          ctx.lineTo(tracePoints.current[i].x, tracePoints.current[i].y);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'rgba(62, 84, 184, 0.3)';
        ctx.arc(
          tracePoints.current[tracePoints.current.length - 1].x,
          tracePoints.current[tracePoints.current.length - 1].y,
          4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Move signal
      if (signalRef.current.x < 500) {
        const currentNodeIndex = getNextNodeIndex(signalRef.current.x);
        const targetNode = nodes[currentNodeIndex];
        const prevNode = nodes[Math.max(0, currentNodeIndex - 1)];
        
        signalRef.current.x += 2;
        
        const progress = (signalRef.current.x - prevNode.x) / (targetNode.x - prevNode.x);
        signalRef.current.y = prevNode.y + (targetNode.y - prevNode.y) * progress;
        signalRef.current.y += Math.sin(time * 0.1) * 2;
        
        tracePoints.current.push({...signalRef.current});
        
        if (tracePoints.current.length > 50) {
          tracePoints.current.shift();
        }
      } else {
        signalRef.current.x = 50;
        tracePoints.current = [];
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="w-full p-4 bg-transparent rounded-lg">
      <canvas 
        ref={containerRef}
        width={600}
        height={400}
        className="w-full border border-stone rounded-lg"
      />
    </div>
  );
};

export default DiagnosticFlow;
