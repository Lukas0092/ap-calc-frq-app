// ============================================================
// AP Calculus AB FRQ Practice Question Generator
// Based on analysis of College Board FRQs (2000-2024)
// ============================================================

const TOPICS = [
  {
    id: "rate-accumulation",
    name: "Rate & Accumulation",
    icon: "\u222B",
    desc: "Interpret rates from tables/graphs, compute net change using FTC.",
    freq: 95,
    tags: ["FTC", "Riemann Sums", "Average Value"],
  },
  {
    id: "particle-motion",
    name: "Particle Motion",
    icon: "\u2192",
    desc: "Position, velocity, acceleration \u2014 direction, distance, displacement.",
    freq: 88,
    tags: ["Velocity", "Acceleration", "Displacement"],
  },
  {
    id: "area-volume",
    name: "Area & Volume",
    icon: "\u25CE",
    desc: "Area between curves, solids with known cross-sections, disk/washer.",
    freq: 90,
    tags: ["Cross-Sections", "Disk", "Washer"],
  },
  {
    id: "differential-equations",
    name: "Differential Equations",
    icon: "dy/dx",
    desc: "Slope fields, separation of variables, particular solutions.",
    freq: 85,
    tags: ["Slope Fields", "Separation of Variables"],
  },
  {
    id: "function-analysis",
    name: "Function Analysis (f, f\u2032, f\u2033)",
    icon: "f\u2032",
    desc: "Use graphs/tables of f\u2032 to find extrema, concavity, inflection.",
    freq: 92,
    tags: ["Extrema", "Concavity", "Increasing/Decreasing"],
  },
  {
    id: "related-rates",
    name: "Related Rates",
    icon: "dV/dt",
    desc: "Rates of change of related quantities in applied contexts.",
    freq: 55,
    tags: ["Implicit Differentiation", "Applied"],
  },
  {
    id: "mean-value-theorem",
    name: "MVT & EVT",
    icon: "c",
    desc: "Apply Mean Value Theorem and Extreme Value Theorem with justification.",
    freq: 65,
    tags: ["MVT", "EVT", "IVT"],
  },
  {
    id: "table-approximation",
    name: "Tabular Data & Approximation",
    icon: "\u0394",
    desc: "Trapezoidal sums, Riemann sums, and approximations from table data.",
    freq: 80,
    tags: ["Trapezoidal Rule", "Riemann Sums"],
  },
];

// --- Utility functions ---
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function frac(n, d) {
  return `\\frac{${n}}{${d}}`;
}

// --- Question generators by topic ---
const generators = {
  "rate-accumulation": [
    // Type 1: Water tank / rate table
    function () {
      const rates = [];
      const times = [0, 2, 5, 7, 10];
      let v = randInt(3, 8);
      for (let i = 0; i < times.length; i++) {
        rates.push(v);
        v += randInt(-3, 5);
        if (v < 0) v = randInt(1, 4);
      }
      const unit = pick(["gallons", "liters", "cubic feet"]);
      const thing = pick([
        "Water flows into a tank",
        "Oil is pumped into a reservoir",
        "Water is being drained from a pool",
      ]);
      const initAmount = randInt(20, 60);

      let tableHTML = '<table class="data-table"><tr><th>$t$ (minutes)</th>';
      times.forEach((t) => (tableHTML += `<td>${t}</td>`));
      tableHTML += "</tr><tr><th>$R(t)$ (${unit}/min)</th>";
      rates.forEach((r) => (tableHTML += `<td>${r}</td>`));
      tableHTML += "</tr></table>";

      // Trapezoidal approximation
      let trapSum = 0;
      for (let i = 0; i < times.length - 1; i++) {
        trapSum +=
          ((rates[i] + rates[i + 1]) / 2) * (times[i + 1] - times[i]);
      }

      return {
        text: `${thing} at a rate of $R(t)$ ${unit} per minute, where $t$ is measured in minutes. The rate $R(t)$ is given in the table below for selected values of $t$. At time $t = 0$, the tank contains ${initAmount} ${unit} of water.\n\n${tableHTML}`,
        parts: [
          {
            label: "(a)",
            text: `Use a trapezoidal sum with the four subintervals indicated by the table to approximate $\\int_0^{${times[times.length - 1]}} R(t)\\,dt$. Show your work.`,
            points: 3,
          },
          {
            label: "(b)",
            text: `Using your answer from part (a), approximate the total amount of water in the tank at $t = ${times[times.length - 1]}$ minutes.`,
            points: 2,
          },
          {
            label: "(c)",
            text: `Is the approximation in part (a) an overestimate or underestimate? Give a reason for your answer.`,
            points: 2,
          },
          {
            label: "(d)",
            text: `What is the average rate of flow, in ${unit} per minute, over the interval $0 \\le t \\le ${times[times.length - 1]}$? Use your approximation from (a).`,
            points: 2,
          },
        ],
        solution: [
          {
            label: "Part (a)",
            body: `Using the trapezoidal rule:\n\n$\\int_0^{${times[times.length - 1]}} R(t)\\,dt \\approx ${times
              .slice(0, -1)
              .map(
                (t, i) =>
                  `\\frac{${rates[i]}+${rates[i + 1]}}{2}\\cdot(${times[i + 1]}-${t})`
              )
              .join(" + ")}$\n\n$= ${trapSum.toFixed(2)}$ ${unit}`,
          },
          {
            label: "Part (b)",
            body: `Total water $= ${initAmount} + ${trapSum.toFixed(2)} = ${(initAmount + trapSum).toFixed(2)}$ ${unit}`,
          },
          {
            label: "Part (c)",
            body: `Examine whether $R(t)$ is concave up or concave down over the intervals. If $R(t)$ is concave up, the trapezoidal approximation is an overestimate. If concave down, it is an underestimate. Check the rate of change of $R(t)$ from the table to determine concavity.`,
          },
          {
            label: "Part (d)",
            body: `Average rate $= \\frac{1}{${times[times.length - 1]}-0}\\int_0^{${times[times.length - 1]}} R(t)\\,dt \\approx \\frac{${trapSum.toFixed(2)}}{${times[times.length - 1]}} = ${(trapSum / times[times.length - 1]).toFixed(3)}$ ${unit}/min`,
          },
        ],
      };
    },
    // Type 2: Continuous rate function
    function () {
      const a = randInt(2, 6);
      const b = randInt(1, 4);
      const T = randInt(4, 8);
      const initVal = randInt(10, 50);
      const context = pick([
        "People enter a concert venue",
        "Cars enter a parking garage",
        "Customers arrive at a store",
      ]);

      return {
        text: `${context} at a rate modeled by $R(t) = ${a}t\\sin\\left(${frac("\\pi t", b)}\\right)$ for $0 \\le t \\le ${T}$, where $t$ is measured in hours and $R(t)$ is measured in people per hour. At time $t = 0$, there are ${initVal} people already inside.`,
        parts: [
          {
            label: "(a)",
            text: `Find $R'(${Math.min(2, T - 1)})$. Using correct units, explain the meaning of $R'(${Math.min(2, T - 1)})$ in the context of this problem.`,
            points: 3,
          },
          {
            label: "(b)",
            text: `Write, but do not evaluate, an expression involving an integral for the total number of people who entered the venue during the time interval $0 \\le t \\le ${T}$.`,
            points: 2,
          },
          {
            label: "(c)",
            text: `At what time $t$, for $0 < t \\le ${T}$, is the rate of people entering the venue at its maximum? Justify your answer.`,
            points: 4,
          },
        ],
        solution: [
          {
            label: "Part (a)",
            body: `Use the product rule:\n\n$R'(t) = ${a}\\sin\\left(${frac("\\pi t", b)}\\right) + ${a}t \\cdot \\cos\\left(${frac("\\pi t", b)}\\right) \\cdot \\frac{\\pi}{${b}}$\n\nEvaluate at $t = ${Math.min(2, T - 1)}$ and interpret: $R'(${Math.min(2, T - 1)})$ represents the rate at which the rate of people entering is changing at $t = ${Math.min(2, T - 1)}$ hours, in people per hour per hour.`,
          },
          {
            label: "Part (b)",
            body: `Total people who entered $= \\int_0^{${T}} R(t)\\,dt = \\int_0^{${T}} ${a}t\\sin\\left(${frac("\\pi t", b)}\\right)dt$`,
          },
          {
            label: "Part (c)",
            body: `Set $R'(t) = 0$ and solve. Use the first derivative test or candidates test on $[0, ${T}]$. Check $R'(t)$ sign changes. The maximum occurs where $R'$ changes from positive to negative. Evaluate $R(t)$ at critical points and endpoints.`,
          },
        ],
      };
    },
  ],

  "particle-motion": [
    function () {
      const a = randInt(2, 5);
      const b = randInt(1, 6);
      const c = randInt(1, 10);
      const T = randInt(4, 8);
      const x0 = randInt(-5, 10);

      return {
        text: `A particle moves along the $x$-axis so that its velocity at time $t$, for $0 \\le t \\le ${T}$, is given by $v(t) = ${a}t^2 - ${a * 2 + b}t + ${b}$. At time $t = 0$, the particle is at position $x = ${x0}$.`,
        parts: [
          {
            label: "(a)",
            text: `Find the acceleration of the particle at time $t = ${Math.min(3, T)}$.`,
            points: 2,
          },
          {
            label: "(b)",
            text: `Find all times $t$ in the interval $0 \\le t \\le ${T}$ when the particle changes direction. Justify your answer.`,
            points: 3,
          },
          {
            label: "(c)",
            text: `Find the position of the particle at time $t = ${Math.min(3, T)}$.`,
            points: 3,
          },
          {
            label: "(d)",
            text: `Find the total distance traveled by the particle over the interval $0 \\le t \\le ${Math.min(3, T)}$.`,
            points: 3,
          },
        ],
        solution: [
          {
            label: "Part (a)",
            body: `$a(t) = v'(t) = ${2 * a}t - ${a * 2 + b}$\n\n$a(${Math.min(3, T)}) = ${2 * a * Math.min(3, T) - (a * 2 + b)}$`,
          },
          {
            label: "Part (b)",
            body: `The particle changes direction when $v(t)$ changes sign. Set $v(t) = 0$:\n\n$${a}t^2 - ${a * 2 + b}t + ${b} = 0$\n\nUse the quadratic formula. The particle changes direction at values of $t$ where $v(t) = 0$ AND $v(t)$ changes sign (verify by checking the sign of $v$ on either side).`,
          },
          {
            label: "Part (c)",
            body: `$x(${Math.min(3, T)}) = x(0) + \\int_0^{${Math.min(3, T)}} v(t)\\,dt = ${x0} + \\int_0^{${Math.min(3, T)}} (${a}t^2 - ${a * 2 + b}t + ${b})\\,dt$\n\nEvaluate: $= ${x0} + \\left[${frac(a, 3)}t^3 - ${frac(a * 2 + b, 2)}t^2 + ${b}t\\right]_0^{${Math.min(3, T)}}$`,
          },
          {
            label: "Part (d)",
            body: `Total distance $= \\int_0^{${Math.min(3, T)}} |v(t)|\\,dt$\n\nFind where $v(t) = 0$ on $[0, ${Math.min(3, T)}]$, then split the integral at those points, taking absolute values on each subinterval.`,
          },
        ],
      };
    },
    function () {
      const a = randInt(2, 5);
      const b = randInt(1, 3);
      const T = randInt(5, 10);
      const y0 = randInt(-3, 5);

      return {
        text: `A particle moves along the $y$-axis with velocity given by $v(t) = ${a}\\cos(${b === 1 ? "" : b}t) - 1$ for $t \\ge 0$. At time $t = 0$, the particle is at $y = ${y0}$.`,
        parts: [
          {
            label: "(a)",
            text: `Find the acceleration of the particle at time $t = \\frac{\\pi}{${2 * b}}$.`,
            points: 2,
          },
          {
            label: "(b)",
            text: `Is the speed of the particle increasing or decreasing at $t = \\frac{\\pi}{${2 * b}}$? Give a reason for your answer.`,
            points: 2,
          },
          {
            label: "(c)",
            text: `Find the position of the particle at time $t = \\frac{\\pi}{${b}}$.`,
            points: 3,
          },
          {
            label: "(d)",
            text: `Find the total distance traveled by the particle from $t = 0$ to $t = \\frac{\\pi}{${b}}$.`,
            points: 2,
          },
        ],
        solution: [
          {
            label: "Part (a)",
            body: `$a(t) = v'(t) = -${a * b}\\sin(${b === 1 ? "" : b}t)$\n\n$a\\left(\\frac{\\pi}{${2 * b}}\\right) = -${a * b}\\sin\\left(\\frac{\\pi}{2}\\right) = -${a * b}$`,
          },
          {
            label: "Part (b)",
            body: `At $t = \\frac{\\pi}{${2 * b}}$:\n- $v\\left(\\frac{\\pi}{${2 * b}}\\right) = ${a}\\cos\\left(\\frac{\\pi}{2}\\right) - 1 = -1 < 0$\n- $a\\left(\\frac{\\pi}{${2 * b}}\\right) = -${a * b} < 0$\n\nSince $v$ and $a$ have the same sign (both negative), the speed is **increasing**.`,
          },
          {
            label: "Part (c)",
            body: `$y\\left(\\frac{\\pi}{${b}}\\right) = ${y0} + \\int_0^{\\pi/${b}} \\left(${a}\\cos(${b === 1 ? "" : b}t) - 1\\right)dt$\n\n$= ${y0} + \\left[${b === 1 ? a : frac(a, b)}\\sin(${b === 1 ? "" : b}t) - t\\right]_0^{\\pi/${b}}$\n\n$= ${y0} + ${b === 1 ? a : frac(a, b)}\\sin(\\pi) - \\frac{\\pi}{${b}} = ${y0} - \\frac{\\pi}{${b}}$`,
          },
          {
            label: "Part (d)",
            body: `Total distance $= \\int_0^{\\pi/${b}} |v(t)|\\,dt = \\int_0^{\\pi/${b}} |${a}\\cos(${b === 1 ? "" : b}t) - 1|\\,dt$\n\nFind where $v(t) = 0$ on $[0, \\pi/${b}]$, split the integral, and evaluate.`,
          },
        ],
      };
    },
  ],

  "area-volume": [
    function () {
      const a = randInt(1, 3);
      const b = randInt(1, 4);
      const shape = pick(["squares", "equilateral triangles", "semicircles"]);
      const areaFormula =
        shape === "squares"
          ? "s^2"
          : shape === "equilateral triangles"
            ? "\\frac{\\sqrt{3}}{4}s^2"
            : "\\frac{\\pi}{8}s^2";

      return {
        text: `Let $R$ be the region bounded by $y = ${a === 1 ? "" : a}\\sqrt{x}$ and $y = ${frac(b === 1 ? "" : b, a === 1 ? 4 : 4 * a)}x$ in the first quadrant.`,
        parts: [
          {
            label: "(a)",
            text: `Find the area of region $R$.`,
            points: 3,
          },
          {
            label: "(b)",
            text: `Write, but do not evaluate, an integral expression for the volume of the solid generated when $R$ is revolved about the $x$-axis.`,
            points: 3,
          },
          {
            label: "(c)",
            text: `The region $R$ is the base of a solid. For this solid, each cross section perpendicular to the $x$-axis is a ${shape.slice(0, -1)} whose side length is the distance between the curves. Write, but do not evaluate, an integral expression for the volume of this solid.`,
            points: 3,
          },
        ],
        solution: [
          {
            label: "Part (a)",
            body: `First find intersection points by setting $${a === 1 ? "" : a}\\sqrt{x} = ${frac(b === 1 ? "" : b, a === 1 ? 4 : 4 * a)}x$.\n\nSolve for $x$: square both sides, collect terms, find $x = 0$ and the other intersection.\n\nArea $= \\int_0^{x_1} \\left(${a === 1 ? "" : a}\\sqrt{x} - ${frac(b === 1 ? "" : b, a === 1 ? 4 : 4 * a)}x\\right)dx$\n\nEvaluate using the power rule: $\\int \\sqrt{x}\\,dx = \\frac{2}{3}x^{3/2}$.`,
          },
          {
            label: "Part (b)",
            body: `Using the washer method:\n\n$V = \\pi\\int_0^{x_1} \\left[\\left(${a === 1 ? "" : a}\\sqrt{x}\\right)^2 - \\left(${frac(b === 1 ? "" : b, a === 1 ? 4 : 4 * a)}x\\right)^2\\right]dx$`,
          },
          {
            label: "Part (c)",
            body: `The side length of each cross section is $s = ${a === 1 ? "" : a}\\sqrt{x} - ${frac(b === 1 ? "" : b, a === 1 ? 4 : 4 * a)}x$.\n\nArea of each ${shape.slice(0, -1)}: $A(x) = ${areaFormula}$\n\n$V = \\int_0^{x_1} ${areaFormula.replace(/s/g, `\\left(${a === 1 ? "" : a}\\sqrt{x} - ${frac(b === 1 ? "" : b, a === 1 ? 4 : 4 * a)}x\\right)`)}\\,dx$`,
          },
        ],
      };
    },
    function () {
      const a = randInt(1, 4);
      const b = randInt(1, 3);
      const k = randInt(2, 5);

      return {
        text: `Let $R$ be the region enclosed by $y = ${a}e^{-${b === 1 ? "" : b}x}$, the $x$-axis, the $y$-axis, and the line $x = ${k}$.`,
        parts: [
          {
            label: "(a)",
            text: `Find the area of $R$.`,
            points: 3,
          },
          {
            label: "(b)",
            text: `Write, but do not evaluate, an integral for the volume of the solid generated when $R$ is revolved about the line $y = -1$.`,
            points: 3,
          },
          {
            label: "(c)",
            text: `The region $R$ is the base of a solid whose cross sections perpendicular to the $x$-axis are squares. Find the volume of this solid.`,
            points: 3,
          },
        ],
        solution: [
          {
            label: "Part (a)",
            body: `$A = \\int_0^{${k}} ${a}e^{-${b === 1 ? "" : b}x}\\,dx = \\left[-${b === 1 ? a : frac(a, b)}e^{-${b === 1 ? "" : b}x}\\right]_0^{${k}} = -${b === 1 ? a : frac(a, b)}e^{-${b * k}} + ${b === 1 ? a : frac(a, b)} = ${b === 1 ? a : frac(a, b)}(1 - e^{-${b * k}})$`,
          },
          {
            label: "Part (b)",
            body: `Revolving about $y = -1$ using the washer method:\n\nOuter radius: $R(x) = ${a}e^{-${b === 1 ? "" : b}x} + 1$\nInner radius: $r(x) = 1$\n\n$V = \\pi\\int_0^{${k}} \\left[(${a}e^{-${b === 1 ? "" : b}x} + 1)^2 - 1^2\\right]dx$`,
          },
          {
            label: "Part (c)",
            body: `Side of square $= ${a}e^{-${b === 1 ? "" : b}x}$\n\n$V = \\int_0^{${k}} \\left(${a}e^{-${b === 1 ? "" : b}x}\\right)^2 dx = ${a * a}\\int_0^{${k}} e^{-${2 * b === 2 ? "" : 2 * b}x}\\,dx$\n\n$= ${a * a}\\left[-${2 * b === 1 ? "" : frac(1, 2 * b)}e^{-${2 * b}x}\\right]_0^{${k}}$\n\n$= ${frac(a * a, 2 * b)}(1 - e^{-${2 * b * k}})$`,
          },
        ],
      };
    },
  ],

  "differential-equations": [
    function () {
      const a = randInt(1, 3);
      const b = randInt(1, 4);
      const x0 = randInt(-2, 2);
      const y0 = randInt(1, 5);

      return {
        text: `Consider the differential equation $\\frac{dy}{dx} = ${a === 1 ? "" : a}x(y - ${b})$.`,
        parts: [
          {
            label: "(a)",
            text: `On the axes provided, sketch a slope field for the given differential equation at the six points indicated. (Sketch at points where $x = -1, 0, 1$ and $y = ${b - 1}, ${b}, ${b + 1}$.)`,
            points: 2,
          },
          {
            label: "(b)",
            text: `Find $\\frac{d^2y}{dx^2}$ in terms of $x$ and $y$. Determine whether the solution curve through $(${x0}, ${y0})$ is concave up or concave down at that point. Explain.`,
            points: 3,
          },
          {
            label: "(c)",
            text: `Find the particular solution $y = f(x)$ to the differential equation with initial condition $f(${x0}) = ${y0}$.`,
            points: 4,
          },
        ],
        solution: [
          {
            label: "Part (a)",
            body: `Evaluate $\\frac{dy}{dx} = ${a === 1 ? "" : a}x(y - ${b})$ at each point:\n\nAt $(x, ${b})$: slope $= 0$ for all $x$ (horizontal segments)\nAt $(0, y)$: slope $= 0$ for all $y$\nAt $(-1, ${b - 1})$: slope $= ${a === 1 ? "" : a}(-1)(${b - 1}-${b}) = ${a}$\nAt $(1, ${b - 1})$: slope $= ${a === 1 ? "" : a}(1)(-1) = -${a}$\nAt $(-1, ${b + 1})$: slope $= ${a === 1 ? "" : a}(-1)(1) = -${a}$\nAt $(1, ${b + 1})$: slope $= ${a === 1 ? "" : a}(1)(1) = ${a}$`,
          },
          {
            label: "Part (b)",
            body: `$\\frac{d^2y}{dx^2} = \\frac{d}{dx}[${a === 1 ? "" : a}x(y-${b})] = ${a === 1 ? "" : a}(y-${b}) + ${a === 1 ? "" : a}x\\cdot\\frac{dy}{dx}$\n\n$= ${a === 1 ? "" : a}(y-${b}) + ${a === 1 ? "" : a}x \\cdot ${a === 1 ? "" : a}x(y-${b}) = ${a === 1 ? "" : a}(y-${b})(1 + ${a === 1 ? "" : a}x^2)$\n\nAt $(${x0}, ${y0})$: $\\frac{d^2y}{dx^2} = ${a}(${y0}-${b})(1+${a}\\cdot${x0 * x0}) = ${a * (y0 - b) * (1 + a * x0 * x0)}$\n\nSince this is ${a * (y0 - b) * (1 + a * x0 * x0) > 0 ? "positive" : a * (y0 - b) * (1 + a * x0 * x0) < 0 ? "negative" : "zero"}, the curve is **concave ${a * (y0 - b) * (1 + a * x0 * x0) >= 0 ? "up" : "down"}** at $(${x0}, ${y0})$.`,
          },
          {
            label: "Part (c)",
            body: `Separate variables:\n$\\frac{dy}{y - ${b}} = ${a === 1 ? "" : a}x\\,dx$\n\nIntegrate both sides:\n$\\ln|y - ${b}| = ${a === 1 ? "" : frac(a, 2)}x^2 + C$\n\n$y - ${b} = Ae^{${a === 1 ? "" : frac(a, 2)}x^2}$\n\nApply initial condition $f(${x0}) = ${y0}$:\n$${y0} - ${b} = Ae^{${a === 1 ? "" : frac(a, 2)}\\cdot${x0 * x0}}$\n$A = ${y0 - b > 0 ? "" : ""}\\frac{${y0 - b}}{e^{${a === 1 ? frac(x0 * x0, 2) : frac(a * x0 * x0, 2)}}}$\n\n$y = ${b} + ${y0 - b}e^{${a === 1 ? "" : frac(a, 2)}(x^2 - ${x0 * x0})}$`,
          },
        ],
      };
    },
    function () {
      const a = randInt(1, 3);
      const b = randInt(1, 3);
      const y0 = randInt(2, 6);

      return {
        text: `Consider the differential equation $\\frac{dy}{dx} = \\frac{${a === 1 ? "" : a}x + ${b === 1 ? "" : b}}{y}$ where $y \\neq 0$.`,
        parts: [
          {
            label: "(a)",
            text: `Sketch the slope field at the nine points with $x = -1, 0, 1$ and $y = -1, 1, 2$.`,
            points: 2,
          },
          {
            label: "(b)",
            text: `Let $y = f(x)$ be the particular solution with $f(0) = ${y0}$. Write an equation for the line tangent to the graph of $f$ at $(0, ${y0})$.`,
            points: 2,
          },
          {
            label: "(c)",
            text: `Find the particular solution $y = f(x)$ with initial condition $f(0) = ${y0}$.`,
            points: 5,
          },
        ],
        solution: [
          {
            label: "Part (a)",
            body: `Evaluate $\\frac{dy}{dx} = \\frac{${a === 1 ? "" : a}x + ${b}}{y}$ at each point. For example:\n\nAt $(0, 1)$: slope $= \\frac{${b}}{1} = ${b}$\nAt $(0, 2)$: slope $= \\frac{${b}}{2} = ${b / 2}$\nAt $(1, 1)$: slope $= \\frac{${a}+${b}}{1} = ${a + b}$\n\nDraw short line segments at each point with the appropriate slope.`,
          },
          {
            label: "Part (b)",
            body: `Slope at $(0, ${y0})$: $\\frac{dy}{dx}\\bigg|_{(0,${y0})} = \\frac{${b}}{${y0}}$\n\nTangent line: $y - ${y0} = \\frac{${b}}{${y0}}(x - 0)$\n\n$y = \\frac{${b}}{${y0}}x + ${y0}$`,
          },
          {
            label: "Part (c)",
            body: `Separate variables: $y\\,dy = (${a === 1 ? "" : a}x + ${b})\\,dx$\n\nIntegrate: $\\frac{y^2}{2} = ${a === 1 ? frac(1, 2) : frac(a, 2)}x^2 + ${b}x + C$\n\nApply $f(0) = ${y0}$: $\\frac{${y0 * y0}}{2} = C$, so $C = ${frac(y0 * y0, 2)}$\n\n$\\frac{y^2}{2} = ${a === 1 ? frac(1, 2) : frac(a, 2)}x^2 + ${b}x + ${frac(y0 * y0, 2)}$\n\n$y = \\sqrt{${a}x^2 + ${2 * b}x + ${y0 * y0}}$ (positive root since $f(0) = ${y0} > 0$)`,
          },
        ],
      };
    },
  ],

  "function-analysis": [
    function () {
      const roots = [randInt(-3, -1), randInt(1, 2), randInt(3, 5)];
      const a = pick([-1, 1]);

      return {
        text: `Let $f$ be a function defined on $[${roots[0] - 2}, ${roots[2] + 2}]$. The graph of $f'$, the derivative of $f$, consists of two line segments and a semicircle, as shown below.\n\nThe graph of $f'$ has $x$-intercepts at $x = ${roots[0]}$, $x = ${roots[1]}$, and $x = ${roots[2]}$. The graph of $f'$ is positive on $(${roots[0]}, ${roots[1]})$ and $(${roots[2]}, ${roots[2] + 2})$, and negative elsewhere on the domain.`,
        parts: [
          {
            label: "(a)",
            text: `Find all values of $x$ in $(${roots[0] - 2}, ${roots[2] + 2})$ at which $f$ has a relative maximum. Justify your answer.`,
            points: 3,
          },
          {
            label: "(b)",
            text: `Find all values of $x$ in $(${roots[0] - 2}, ${roots[2] + 2})$ at which $f$ has a relative minimum. Justify your answer.`,
            points: 3,
          },
          {
            label: "(c)",
            text: `Find the absolute maximum value of $f$ on $[${roots[0] - 2}, ${roots[2] + 2}]$ if $f(${roots[0] - 2}) = ${randInt(-3, 0)}$. Justify your answer.`,
            points: 4,
          },
          {
            label: "(d)",
            text: `Find the intervals on which $f$ is concave down. Give a reason for your answer.`,
            points: 3,
          },
        ],
        solution: [
          {
            label: "Part (a)",
            body: `$f$ has a relative maximum where $f'$ changes from positive to negative.\n\n$f'$ changes from positive to negative at $x = ${roots[1]}$.\n\nTherefore, $f$ has a relative maximum at $x = ${roots[1]}$.`,
          },
          {
            label: "Part (b)",
            body: `$f$ has a relative minimum where $f'$ changes from negative to positive.\n\n$f'$ changes from negative to positive at $x = ${roots[0]}$ and $x = ${roots[2]}$.\n\nTherefore, $f$ has relative minima at $x = ${roots[0]}$ and $x = ${roots[2]}$.`,
          },
          {
            label: "Part (c)",
            body: `By the Candidates Test, evaluate $f$ at:\n- Endpoints: $x = ${roots[0] - 2}$ and $x = ${roots[2] + 2}$\n- Critical points: $x = ${roots[0]}, ${roots[1]}, ${roots[2]}$\n\nFind $f$ at each point by computing areas under $f'$ (using geometry of the line segments and semicircle).\n\nThe absolute maximum is the largest of these values.`,
          },
          {
            label: "Part (d)",
            body: `$f$ is concave down where $f'$ is decreasing.\n\nExamine the graph of $f'$: identify the intervals where the graph of $f'$ is decreasing (going downward from left to right).`,
          },
        ],
      };
    },
  ],

  "related-rates": [
    function () {
      const scenario = randInt(0, 2);
      if (scenario === 0) {
        const rate = randInt(2, 8);
        const h = randInt(6, 15);
        const r = randInt(3, 8);
        const hAtTime = randInt(2, h - 1);
        return {
          text: `Water is being poured into a conical tank at a rate of ${rate} cubic feet per minute. The tank has a height of ${h} feet and a radius of ${r} feet at the top.`,
          parts: [
            {
              label: "(a)",
              text: `Let $h$ be the height of the water in the tank. Express the radius of the water surface in terms of $h$.`,
              points: 2,
            },
            {
              label: "(b)",
              text: `Express the volume of water in the tank in terms of $h$ only.`,
              points: 2,
            },
            {
              label: "(c)",
              text: `At what rate is the height of the water changing when the water is ${hAtTime} feet deep?`,
              points: 4,
            },
            {
              label: "(d)",
              text: `At what rate is the exposed surface area of the water changing when the water is ${hAtTime} feet deep?`,
              points: 3,
            },
          ],
          solution: [
            {
              label: "Part (a)",
              body: `By similar triangles: $\\frac{r_{water}}{h} = \\frac{${r}}{${h}}$, so $r_{water} = \\frac{${r}}{${h}}h = ${frac(r, h)}h$`,
            },
            {
              label: "Part (b)",
              body: `$V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi\\left(${frac(r, h)}h\\right)^2 h = \\frac{${r * r}\\pi}{${3 * h * h}}h^3$`,
            },
            {
              label: "Part (c)",
              body: `Differentiate with respect to $t$:\n\n$\\frac{dV}{dt} = \\frac{${r * r}\\pi}{${h * h}} h^2 \\frac{dh}{dt}$\n\nSubstitute $\\frac{dV}{dt} = ${rate}$ and $h = ${hAtTime}$:\n\n$${rate} = \\frac{${r * r}\\pi}{${h * h}} \\cdot ${hAtTime * hAtTime} \\cdot \\frac{dh}{dt}$\n\n$\\frac{dh}{dt} = \\frac{${rate} \\cdot ${h * h}}{${r * r}\\pi \\cdot ${hAtTime * hAtTime}} = \\frac{${rate * h * h}}{${r * r * hAtTime * hAtTime}\\pi}$ ft/min`,
            },
            {
              label: "Part (d)",
              body: `Surface area: $A = \\pi r^2 = \\pi\\left(${frac(r, h)}h\\right)^2 = \\frac{${r * r}\\pi}{${h * h}}h^2$\n\n$\\frac{dA}{dt} = \\frac{${2 * r * r}\\pi}{${h * h}} h \\cdot \\frac{dh}{dt}$\n\nSubstitute the values found above to compute $\\frac{dA}{dt}$.`,
            },
          ],
        };
      } else if (scenario === 1) {
        const dxdt = randInt(2, 6);
        const xVal = randInt(3, 8);
        return {
          text: `A 10-foot ladder leans against a vertical wall. The bottom of the ladder slides away from the wall at a rate of ${dxdt} ft/sec.`,
          parts: [
            {
              label: "(a)",
              text: `How fast is the top of the ladder sliding down the wall when the bottom is ${xVal} feet from the wall?`,
              points: 4,
            },
            {
              label: "(b)",
              text: `At the same instant, how fast is the angle between the ladder and the ground changing?`,
              points: 3,
            },
            {
              label: "(c)",
              text: `At the same instant, at what rate is the area of the triangle formed by the ladder, wall, and ground changing?`,
              points: 2,
            },
          ],
          solution: [
            {
              label: "Part (a)",
              body: `$x^2 + y^2 = 100$\n\nDifferentiate: $2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0$\n\nWhen $x = ${xVal}$: $y = \\sqrt{100 - ${xVal * xVal}} = \\sqrt{${100 - xVal * xVal}}$\n\n$2(${xVal})(${dxdt}) + 2\\sqrt{${100 - xVal * xVal}}\\cdot\\frac{dy}{dt} = 0$\n\n$\\frac{dy}{dt} = -\\frac{${xVal * dxdt}}{\\sqrt{${100 - xVal * xVal}}}$ ft/sec`,
            },
            {
              label: "Part (b)",
              body: `$\\cos\\theta = \\frac{x}{10}$\n\n$-\\sin\\theta \\cdot \\frac{d\\theta}{dt} = \\frac{1}{10}\\frac{dx}{dt}$\n\n$\\sin\\theta = \\frac{y}{10} = \\frac{\\sqrt{${100 - xVal * xVal}}}{10}$\n\n$\\frac{d\\theta}{dt} = -\\frac{${dxdt}}{\\sqrt{${100 - xVal * xVal}}}$ rad/sec`,
            },
            {
              label: "Part (c)",
              body: `$A = \\frac{1}{2}xy$\n\n$\\frac{dA}{dt} = \\frac{1}{2}\\left(x\\frac{dy}{dt} + y\\frac{dx}{dt}\\right)$\n\nSubstitute all known values to find $\\frac{dA}{dt}$.`,
            },
          ],
        };
      } else {
        const dr = randInt(1, 3);
        const rVal = randInt(4, 10);
        return {
          text: `A spherical balloon is being inflated. The radius of the balloon is increasing at a rate of ${dr} cm/sec.`,
          parts: [
            {
              label: "(a)",
              text: `At what rate is the volume of the balloon increasing when the radius is ${rVal} cm?`,
              points: 3,
            },
            {
              label: "(b)",
              text: `At what rate is the surface area increasing at the same instant?`,
              points: 3,
            },
            {
              label: "(c)",
              text: `If the balloon started from radius $0$, find the volume as a function of time $t$ (in seconds). What is the rate of change of volume with respect to time at $t = ${randInt(2, 5)}$ seconds?`,
              points: 3,
            },
          ],
          solution: [
            {
              label: "Part (a)",
              body: `$V = \\frac{4}{3}\\pi r^3$\n\n$\\frac{dV}{dt} = 4\\pi r^2 \\frac{dr}{dt} = 4\\pi(${rVal})^2(${dr}) = ${4 * rVal * rVal * dr}\\pi$ cm\u00B3/sec`,
            },
            {
              label: "Part (b)",
              body: `$S = 4\\pi r^2$\n\n$\\frac{dS}{dt} = 8\\pi r \\frac{dr}{dt} = 8\\pi(${rVal})(${dr}) = ${8 * rVal * dr}\\pi$ cm\u00B2/sec`,
            },
            {
              label: "Part (c)",
              body: `Since $r = ${dr}t$ (radius starts at 0 and increases at ${dr} cm/sec):\n\n$V(t) = \\frac{4}{3}\\pi(${dr}t)^3 = \\frac{${4 * dr * dr * dr}}{3}\\pi t^3$\n\nDifferentiate and evaluate at the given time.`,
            },
          ],
        };
      }
    },
  ],

  "mean-value-theorem": [
    function () {
      const times = [0, 2, 4, 7, 10, 12];
      const temps = [];
      let temp = randInt(60, 85);
      for (let i = 0; i < times.length; i++) {
        temps.push(temp);
        temp += randInt(-8, 5);
      }
      const thing = pick(["temperature of a cup of coffee", "temperature inside an oven", "temperature of a cooling metal rod"]);
      const unit = "\u00B0F";

      let tableHTML = '<table class="data-table"><tr><th>$t$ (min)</th>';
      times.forEach((t) => (tableHTML += `<td>${t}</td>`));
      tableHTML += `</tr><tr><th>$T(t)$ (${unit})</th>`;
      temps.forEach((v) => (tableHTML += `<td>${v}</td>`));
      tableHTML += "</tr></table>";

      const avgRate = ((temps[temps.length - 1] - temps[0]) / (times[times.length - 1] - times[0])).toFixed(3);

      return {
        text: `The ${thing}, in degrees Fahrenheit, at time $t$ minutes is given by a twice-differentiable function $T(t)$. Selected values are shown in the table below.\n\n${tableHTML}`,
        parts: [
          {
            label: "(a)",
            text: `Use data from the table to find an approximation for $T'(${times[2]})$. Show the computation that leads to your answer and indicate units.`,
            points: 2,
          },
          {
            label: "(b)",
            text: `Is there a time $t$, $${times[0]} < t < ${times[times.length - 1]}$, at which $T'(t) = ${avgRate}$? Justify your answer.`,
            points: 3,
          },
          {
            label: "(c)",
            text: `Use a trapezoidal sum with the five subintervals indicated by the table to approximate $\\frac{1}{${times[times.length - 1]}}\\int_0^{${times[times.length - 1]}} T(t)\\,dt$. Using correct units, explain the meaning of this expression.`,
            points: 4,
          },
          {
            label: "(d)",
            text: `Is there a time $t$, $${times[0]} < t < ${times[times.length - 1]}$, at which $T''(t) = 0$? Justify your answer.`,
            points: 2,
          },
        ],
        solution: [
          {
            label: "Part (a)",
            body: `$T'(${times[2]}) \\approx \\frac{T(${times[3]}) - T(${times[1]})}{${times[3]} - ${times[1]}} = \\frac{${temps[3]} - ${temps[1]}}{${times[3] - times[1]}} = ${((temps[3] - temps[1]) / (times[3] - times[1])).toFixed(3)}$ ${unit}/min`,
          },
          {
            label: "Part (b)",
            body: `The Mean Value Theorem states that if $T$ is continuous on $[${times[0]}, ${times[times.length - 1]}]$ and differentiable on $(${times[0]}, ${times[times.length - 1]})$, then there exists $c$ such that:\n\n$T'(c) = \\frac{T(${times[times.length - 1]}) - T(${times[0]})}{${times[times.length - 1]} - ${times[0]}} = \\frac{${temps[temps.length - 1]} - ${temps[0]}}{${times[times.length - 1]}} = ${avgRate}$\n\nSince $T$ is twice-differentiable (hence continuous and differentiable), the MVT guarantees such a time exists. **Yes.**`,
          },
          {
            label: "Part (c)",
            body: `$\\frac{1}{${times[times.length - 1]}}\\int_0^{${times[times.length - 1]}} T(t)\\,dt$ represents the **average temperature** over the interval $[0, ${times[times.length - 1]}]$ minutes.\n\nTrapezoidal sum: compute each trapezoid and divide by ${times[times.length - 1]}.`,
          },
          {
            label: "Part (d)",
            body: `Since $T$ is twice differentiable, $T'$ is continuous. If $T'$ changes from increasing to decreasing (or vice versa) at any point in the interval, by the Intermediate Value Theorem applied to $T''$, there must be a point where $T'' = 0$.\n\nCompute $T'$ approximations on consecutive subintervals and check if $T'$ changes direction.`,
          },
        ],
      };
    },
  ],

  "table-approximation": [
    function () {
      const n = 5;
      const times = [0];
      for (let i = 1; i <= n; i++) times.push(times[i - 1] + randInt(1, 3));
      const values = [randInt(10, 30)];
      for (let i = 1; i <= n; i++) values.push(values[i - 1] + randInt(-5, 8));

      const context = pick([
        "The rate of water flow, in gallons per hour, into a tank",
        "The velocity of a car, in meters per second",
        "The rate at which fuel is consumed, in gallons per hour",
      ]);

      let tableHTML = '<table class="data-table"><tr><th>$t$</th>';
      times.forEach((t) => (tableHTML += `<td>${t}</td>`));
      tableHTML += "</tr><tr><th>$f(t)$</th>";
      values.forEach((v) => (tableHTML += `<td>${v}</td>`));
      tableHTML += "</tr></table>";

      // Compute answers
      let leftSum = 0, rightSum = 0, trapSum = 0;
      for (let i = 0; i < n; i++) {
        const dt = times[i + 1] - times[i];
        leftSum += values[i] * dt;
        rightSum += values[i + 1] * dt;
        trapSum += ((values[i] + values[i + 1]) / 2) * dt;
      }

      // Midpoint approx for f'
      const midIdx = Math.floor(n / 2);
      const fprime = ((values[midIdx + 1] - values[midIdx - 1]) / (times[midIdx + 1] - times[midIdx - 1])).toFixed(3);

      return {
        text: `${context} is modeled by a continuous function $f(t)$, where $t$ is measured in appropriate units. Values of $f(t)$ are given in the table below.\n\n${tableHTML}`,
        parts: [
          {
            label: "(a)",
            text: `Use a left Riemann sum with the ${n} subintervals indicated by the table to approximate $\\int_{${times[0]}}^{${times[n]}} f(t)\\,dt$. Show the computations.`,
            points: 2,
          },
          {
            label: "(b)",
            text: `Use a right Riemann sum with the ${n} subintervals indicated by the table to approximate $\\int_{${times[0]}}^{${times[n]}} f(t)\\,dt$.`,
            points: 2,
          },
          {
            label: "(c)",
            text: `Use a trapezoidal sum with the ${n} subintervals to approximate $\\int_{${times[0]}}^{${times[n]}} f(t)\\,dt$.`,
            points: 3,
          },
          {
            label: "(d)",
            text: `Approximate $f'(${times[midIdx]})$ using the data in the table. Show the computation and indicate units.`,
            points: 2,
          },
        ],
        solution: [
          {
            label: "Part (a)",
            body: `Left Riemann sum:\n\n$L = ${times.slice(0, -1).map((t, i) => `${values[i]}\\cdot(${times[i + 1]}-${t})`).join(" + ")}$\n\n$= ${leftSum}$`,
          },
          {
            label: "Part (b)",
            body: `Right Riemann sum:\n\n$R = ${times.slice(1).map((t, i) => `${values[i + 1]}\\cdot(${t}-${times[i]})`).join(" + ")}$\n\n$= ${rightSum}$`,
          },
          {
            label: "Part (c)",
            body: `Trapezoidal sum:\n\n$T = ${times.slice(0, -1).map((t, i) => `\\frac{${values[i]}+${values[i + 1]}}{2}\\cdot(${times[i + 1]}-${t})`).join(" + ")}$\n\n$= ${trapSum}$\n\nNote: $T = \\frac{L+R}{2} = \\frac{${leftSum}+${rightSum}}{2} = ${trapSum}$`,
          },
          {
            label: "Part (d)",
            body: `$f'(${times[midIdx]}) \\approx \\frac{f(${times[midIdx + 1]}) - f(${times[midIdx - 1]})}{${times[midIdx + 1]} - ${times[midIdx - 1]}} = \\frac{${values[midIdx + 1]} - ${values[midIdx - 1]}}{${times[midIdx + 1] - times[midIdx - 1]}} = ${fprime}$ units per time unit`,
          },
        ],
      };
    },
  ],
};

// Generate a question for a given topic
function generateQuestion(topicId) {
  const gens = generators[topicId];
  if (!gens || gens.length === 0) return null;
  const gen = pick(gens);
  return gen();
}
