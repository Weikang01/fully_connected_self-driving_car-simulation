class Visualizer {
  static drawNetwork(ctx, brain) {
    // draw circles for each node
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;
    const bottom = top + height;

    for (let i = 1; i >= 0; i--) {
      // const level = brain.levels[i];
      Visualizer.drawLevel(
        ctx,
        brain.levels[i],
        left,
        bottom - (height / brain.levels.length) * i,
        width,
        height / brain.levels.length
      );
    }
    const right = left + width;
    const { inputs } = brain.levels[0];
    const nodeRadius = 8;

    for (let i = 0; i < inputs.length; i++) {
      const x = lerp(
        left,
        right,
        inputs.length == 1 ? 0.5 : i / (inputs.length - 1)
      );

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Visualizer.drawLevel(ctx, brain.levels[0], left, top, width, height);
  }

  static drawLevel(ctx, level, left, bottom, width, height) {
    const right = left + width;
    const top = bottom - height;

    const { inputs, outputs, weights } = level;
    const nodeRadius = 8;

    for (let i = 0; i < outputs.length; i++) {
      const x = lerp(
        left,
        right,
        outputs.length == 1 ? 0.5 : i / (outputs.length - 1)
      );

      for (let j = 0; j < inputs.length; j++) {
        const x_prime = lerp(
          left,
          right,
          inputs.length == 1 ? 0.5 : j / (inputs.length - 1)
        );
        ctx.strokeStyle =
          weights[i][j] > 0
            ? "rgba(255,145,0," + weights[i][j] + ")"
            : "rgba(0,100,255," + -weights[i][j] + ")";
        ctx.moveTo(x, top);
        ctx.lineTo(x_prime, bottom);
        ctx.stroke();
        ctx.closePath();
      }

      ctx.lineWidth = 0;

      ctx.fillStyle = "white";
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }

    // for (let i = 0; i < outputs.length; i++) {
    //   const x = lerp(
    //     left,
    //     right,
    //     outputs.length == 1 ? 0.5 : i / (outputs.length - 1)
    //   );

    //   ctx.fillStyle = "white";
    //   ctx.beginPath();
    //   ctx.arc(x, top, nodeRadius, 0, 2 * Math.PI);
    //   ctx.fill();
    // }
  }
}
