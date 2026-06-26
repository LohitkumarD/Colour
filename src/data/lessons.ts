import type { Lesson } from '@/types/lesson';

export const LESSONS: Lesson[] = [
  {
    id: 'color-basics',
    title: 'Color Theory Fundamentals',
    summary: 'What color actually is, and the three properties that describe every shade.',
    level: 'beginner',
    durationMin: 6,
    icon: 'Disc3',
    sections: [
      {
        heading: 'What is color?',
        body: 'Color is how our brains interpret different wavelengths of visible light. When light hits an object, some wavelengths are absorbed and others reflected back into our eyes, where cone cells translate them into the sensation we call color.',
      },
      {
        heading: 'Hue, saturation, lightness',
        body: 'Every color can be described with three properties: hue is its position on the color wheel (red, blue, green…), saturation is its intensity or purity, and lightness is how close it sits to black or white.',
      },
      {
        heading: 'Warm vs. cool colors',
        body: 'Reds, oranges and yellows are considered warm — they feel energetic and advance toward the viewer. Blues, greens and purples are cool — they feel calm and recede. Mixing temperature is a powerful way to create contrast and mood.',
      },
    ],
    quiz: [
      {
        id: 'cb-1',
        question: 'Which property of color refers to its position on the color wheel?',
        options: ['Hue', 'Saturation', 'Lightness', 'Contrast'],
        correctIndex: 0,
        explanation: 'Hue is the attribute that names a color — red, blue, green — based on where it falls around the wheel.',
      },
      {
        id: 'cb-2',
        question: 'Which of these is considered a "cool" color?',
        options: ['Red', 'Orange', 'Blue', 'Yellow'],
        correctIndex: 2,
        explanation: 'Blue, along with green and purple, is classified as a cool color — it tends to feel calm and recede visually.',
      },
      {
        id: 'cb-3',
        question: "Saturation describes a color's...",
        options: ['Position on the wheel', 'Intensity or purity', 'Brightness only', 'Temperature'],
        correctIndex: 1,
        explanation: 'Saturation is how intense or muted a color appears — fully saturated colors look vivid, desaturated ones look gray.',
      },
    ],
  },
  {
    id: 'color-wheel',
    title: 'The Color Wheel Explained',
    summary: 'Primary, secondary and tertiary colors, and how hue angles map around the wheel.',
    level: 'beginner',
    durationMin: 7,
    icon: 'Disc3',
    sections: [
      {
        heading: 'Primary, secondary, tertiary',
        body: "The traditional artist's wheel starts with three primary colors — red, yellow and blue — that can't be made by mixing others. Mixing two primaries gives the secondary colors (orange, green, purple), and mixing a primary with a neighboring secondary gives the six tertiary colors.",
      },
      {
        heading: 'RYB vs. RGB wheels',
        body: 'Painters use the RYB (red-yellow-blue) wheel because it models pigment mixing. Screens use the RGB (red-green-blue) wheel because it models light mixing. The two wheels share the same circular logic but place colors at different angles.',
      },
      {
        heading: 'Reading hue angles',
        body: 'Digital color wheels are measured in degrees, 0–360°. By convention 0° is red, 60° is yellow, 120° is green, 180° is cyan, 240° is blue, and 300° is magenta — a full loop back to red.',
      },
    ],
    quiz: [
      {
        id: 'cw-1',
        question: 'How many primary colors are there in the traditional RYB color wheel?',
        options: ['2', '3', '4', '6'],
        correctIndex: 1,
        explanation: 'Red, yellow and blue are the three RYB primaries — they cannot be created by mixing other colors.',
      },
      {
        id: 'cw-2',
        question: 'Green is created by mixing which two primary colors?',
        options: ['Red + Blue', 'Blue + Yellow', 'Red + Yellow', 'None — green is a primary'],
        correctIndex: 1,
        explanation: 'On the RYB wheel, green is a secondary color made by mixing blue and yellow.',
      },
      {
        id: 'cw-3',
        question: 'On a standard digital hue wheel, what hue angle is pure blue?',
        options: ['0°', '120°', '180°', '240°'],
        correctIndex: 3,
        explanation: 'Pure blue sits at 240° on the standard hue wheel used by HSL and HSV.',
      },
    ],
  },
  {
    id: 'harmony-rules',
    title: 'Color Harmony Rules',
    summary: 'Complementary, analogous, triadic and other reliable recipes for pairing colors.',
    level: 'beginner',
    durationMin: 8,
    icon: 'Palette',
    sections: [
      {
        heading: 'Complementary & split-complementary',
        body: 'Complementary colors sit directly opposite each other (180° apart), creating maximum contrast and vibrancy. Split-complementary softens this by pairing a base color with the two neighbors of its complement, keeping contrast but reducing visual tension.',
      },
      {
        heading: 'Analogous & monochromatic',
        body: 'Analogous palettes use hues that sit close together on the wheel, producing calm, cohesive combinations. Monochromatic palettes go a step further, varying only the lightness and saturation of a single hue for an elegant, unified look.',
      },
      {
        heading: 'Triadic, tetradic & square',
        body: 'Triadic palettes pick three hues evenly spaced 120° apart for a vivid but balanced result. Tetradic and square palettes use four hues — two complementary pairs — for richer, more versatile combinations.',
      },
    ],
    quiz: [
      {
        id: 'hr-1',
        question: 'Complementary colors sit how many degrees apart on the wheel?',
        options: ['90°', '120°', '180°', '270°'],
        correctIndex: 2,
        explanation: 'Complementary pairs sit directly opposite one another, 180° apart on the hue wheel.',
      },
      {
        id: 'hr-2',
        question: 'An analogous palette uses colors that are...',
        options: ['Opposite on the wheel', 'Neighboring on the wheel', 'Evenly spaced 120° apart', 'All the same hue'],
        correctIndex: 1,
        explanation: 'Analogous colors sit next to each other on the wheel, which is why the result feels cohesive and calm.',
      },
      {
        id: 'hr-3',
        question: 'A monochromatic palette varies...',
        options: ['Hue only', 'Lightness and/or saturation of one hue', 'Three separate hues', 'Warm and cool tones'],
        correctIndex: 1,
        explanation: 'Monochromatic schemes keep the hue fixed and create variety through lightness and saturation alone.',
      },
    ],
  },
  {
    id: 'color-psychology',
    title: 'Color Psychology & Meaning',
    summary: 'How culture, context and branding shape the emotional read of a color.',
    level: 'intermediate',
    durationMin: 9,
    icon: 'Sparkles',
    sections: [
      {
        heading: 'Cultural associations',
        body: "Color meaning is rarely universal. Red signals luck and celebration in China, but can signal danger or mourning elsewhere. White is associated with purity in many Western cultures, yet with mourning in parts of East Asia.",
      },
      {
        heading: 'Color in branding',
        body: "Brands lean on common (though not absolute) associations: blue for trust and stability — common in finance and tech; green for growth, health and sustainability; red for energy, urgency and appetite, which is why it dominates fast-food branding.",
      },
      {
        heading: 'Context matters more than universals',
        body: "The same hue can read differently depending on saturation, surrounding colors, and the audience's background. Effective design treats color psychology as a strong starting hypothesis to test, not a fixed rulebook.",
      },
    ],
    quiz: [
      {
        id: 'cp-1',
        question: 'Which color is most commonly associated with trust and stability in Western branding?',
        options: ['Red', 'Blue', 'Yellow', 'Purple'],
        correctIndex: 1,
        explanation: 'Blue is widely used by banks and tech companies because it tends to read as trustworthy and stable.',
      },
      {
        id: 'cp-2',
        question: 'Color meaning is best described as...',
        options: ['Universal across all cultures', 'Entirely random', 'Shaped by culture and context', 'Fixed by wavelength'],
        correctIndex: 2,
        explanation: 'The same color can carry very different meanings depending on cultural background and context.',
      },
      {
        id: 'cp-3',
        question: 'Which color is frequently used to create urgency or stimulate appetite?',
        options: ['Blue', 'Green', 'Red', 'Gray'],
        correctIndex: 2,
        explanation: 'Red is strongly linked with urgency and appetite, which is why it appears so often in food and sale branding.',
      },
    ],
  },
  {
    id: 'color-models',
    title: 'RGB, CMYK, HSL & HSV',
    summary: 'The major color models, what each is built for, and when to reach for one.',
    level: 'intermediate',
    durationMin: 10,
    icon: 'Blend',
    sections: [
      {
        heading: 'RGB: additive light for screens',
        body: 'RGB mixes red, green and blue light additively — combining all three at full intensity produces white. It maps directly to how screen pixels emit light, making it the standard for digital displays.',
      },
      {
        heading: 'CMYK: subtractive ink for print',
        body: 'CMYK (cyan, magenta, yellow, black) works subtractively: inks absorb light rather than emit it, so combining all of them approaches black. Print production relies on CMYK because it models how ink behaves on paper.',
      },
      {
        heading: 'HSL/HSV: human-friendly models',
        body: 'HSL (hue, saturation, lightness) and HSV (hue, saturation, value) re-express RGB in terms people reason about naturally — picking a hue, then adjusting how rich or how light/dark it is — which is why color pickers favor them.',
      },
    ],
    quiz: [
      {
        id: 'cm-1',
        question: 'RGB color mixing is...',
        options: ['Subtractive, for print', 'Additive, for light/screens', 'Only used in print', 'Based on pigment'],
        correctIndex: 1,
        explanation: 'RGB is additive — it models how colored light combines, which is exactly what screen pixels do.',
      },
      {
        id: 'cm-2',
        question: 'CMYK is the standard model for...',
        options: ['Screen displays', 'Print production', 'Color blindness simulation', '3D rendering'],
        correctIndex: 1,
        explanation: 'CMYK models subtractive ink mixing, making it the standard for professional print production.',
      },
      {
        id: 'cm-3',
        question: "What does the 'L' in HSL stand for?",
        options: ['Luminance only', 'Lightness', 'Level', 'Linearity'],
        correctIndex: 1,
        explanation: 'HSL stands for Hue, Saturation, Lightness — lightness controls how close a color sits to black or white.',
      },
    ],
  },
  {
    id: 'accessibility-contrast',
    title: 'Accessibility & Contrast',
    summary: 'Why contrast matters and what the WCAG guidelines actually require.',
    level: 'intermediate',
    durationMin: 8,
    icon: 'Contrast',
    sections: [
      {
        heading: 'Why contrast matters',
        body: 'Low contrast between text and its background makes content hard to read for everyone, and can make it unreadable for people with low vision or color vision deficiencies. Sufficient contrast is one of the simplest, highest-impact accessibility wins available.',
      },
      {
        heading: 'WCAG contrast ratios',
        body: 'WCAG 2.1 sets minimum contrast ratios: level AA requires at least 4.5:1 for normal text and 3:1 for large text (18pt+ or bold 14pt+). The stricter AAA level raises that to 7:1 for normal text and 4.5:1 for large text.',
      },
      {
        heading: 'Practical tips',
        body: "Never rely on color alone to convey meaning — pair it with icons, labels or patterns. Test every foreground/background combination you ship, and remember that contrast requirements apply to UI components and graphics, not just body copy.",
      },
    ],
    quiz: [
      {
        id: 'ac-1',
        question: 'What is the minimum WCAG AA contrast ratio for normal body text?',
        options: ['3:1', '4.5:1', '7:1', '2:1'],
        correctIndex: 1,
        explanation: 'WCAG AA requires a contrast ratio of at least 4.5:1 for normal-sized text.',
      },
      {
        id: 'ac-2',
        question: 'WCAG AAA requires a higher contrast ratio than AA.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'AAA is the stricter level, requiring 7:1 for normal text compared to 4.5:1 under AA.',
      },
      {
        id: 'ac-3',
        question: 'Which is a recommended accessibility practice?',
        options: [
          'Use color as the only way to convey meaning',
          'Always use pure black on pure white',
          'Avoid relying on color alone to convey information',
          'Ignore contrast for large text',
        ],
        correctIndex: 2,
        explanation: 'Pairing color with text, icons or patterns ensures information is not lost for people who cannot distinguish certain colors.',
      },
    ],
  },
  {
    id: 'inclusive-design',
    title: 'Color Blindness & Inclusive Design',
    summary: 'How color vision deficiency works, and how to design so it never excludes anyone.',
    level: 'intermediate',
    durationMin: 7,
    icon: 'Eye',
    sections: [
      {
        heading: 'Types of color vision deficiency',
        body: 'Protanopia and deuteranopia reduce sensitivity to red and green respectively, making the two hues hard to tell apart. Tritanopia affects blue-yellow perception, and achromatopsia — much rarer — removes color perception almost entirely.',
      },
      {
        heading: 'How common is it',
        body: 'Red-green color blindness affects roughly 1 in 12 men (about 8%) and 1 in 200 women (about 0.5%), making it one of the most common inherited conditions designers will encounter in their audience.',
      },
      {
        heading: 'Designing for everyone',
        body: "Pair color coding with shapes, icons, patterns or text labels so meaning survives even if a hue can't be distinguished. Run your designs through a color blindness simulator before shipping, and choose palettes that stay distinguishable across all vision types.",
      },
    ],
    quiz: [
      {
        id: 'id-1',
        question: 'Which type of color blindness involves difficulty distinguishing red and green?',
        options: ['Tritanopia', 'Protanopia and deuteranopia', 'Achromatopsia', 'None of the above'],
        correctIndex: 1,
        explanation: 'Protanopia and deuteranopia both affect red-green discrimination, just via different photoreceptor deficiencies.',
      },
      {
        id: 'id-2',
        question: 'Roughly what percentage of men have some form of red-green color blindness?',
        options: ['1%', '8%', '25%', '50%'],
        correctIndex: 1,
        explanation: 'About 8% of men (roughly 1 in 12) have some form of red-green color vision deficiency.',
      },
      {
        id: 'id-3',
        question: 'A good inclusive-design practice is to...',
        options: [
          'Rely solely on color to differentiate elements',
          'Pair color with shape, icon, or text labels',
          'Use only grayscale',
          'Avoid contrast checks',
        ],
        correctIndex: 1,
        explanation: 'Redundant encoding — color plus shape, icon, or label — keeps information accessible to people with any type of color vision.',
      },
    ],
  },
  {
    id: 'gradients-mixing',
    title: 'Gradients & Color Mixing',
    summary: 'Gradient types, the "muddy middle" problem, and how pigment mixing differs from light.',
    level: 'advanced',
    durationMin: 8,
    icon: 'Waves',
    sections: [
      {
        heading: 'Linear, radial & angular gradients',
        body: 'Linear gradients transition along a straight line, radial gradients radiate outward from a center point, and angular (conic) gradients sweep around a center like a clock hand — each shape implies a different visual motion.',
      },
      {
        heading: 'Interpolation spaces',
        body: 'Blending two colors directly in RGB or sRGB often passes through a dull, muddy middle — red to green this way drifts through brown. Interpolating in a perceptual space like LAB, OKLab or even HSL with the short hue path keeps transitions vivid and intentional.',
      },
      {
        heading: 'Pigment vs. digital mixing',
        body: 'Mixing paint is a subtractive, physical process governed by pigment chemistry, not simple RGB averaging — that is why mixing a digital red and green gives muddy brown while real paint behaves differently again depending on the specific pigments.',
      },
    ],
    quiz: [
      {
        id: 'gm-1',
        question: 'Interpolating a gradient directly in RGB between red and green often produces a...',
        options: ['Vibrant yellow', 'Muddy brown/gray', 'Pure white', 'No change'],
        correctIndex: 1,
        explanation: 'Naive RGB interpolation between red and green tends to pass through a dull, muddy middle rather than a vivid one.',
      },
      {
        id: 'gm-2',
        question: 'Mixing paint pigments is best modeled as...',
        options: ['Additive mixing', 'Subtractive mixing', 'RGB blending', 'HSL blending'],
        correctIndex: 1,
        explanation: 'Pigments absorb (subtract) light rather than emit it, so paint mixing follows subtractive color theory.',
      },
      {
        id: 'gm-3',
        question: 'Which gradient type radiates outward from a center point?',
        options: ['Linear', 'Radial', 'Angular', 'Mesh'],
        correctIndex: 1,
        explanation: 'Radial gradients expand outward in circles or ellipses from a defined center point.',
      },
    ],
  },
  {
    id: 'perceptual-color',
    title: 'Perceptual Color Spaces (LAB & OKLCH)',
    summary: 'Why device-independent, perceptually uniform spaces exist and how OKLCH improves on LAB.',
    level: 'advanced',
    durationMin: 10,
    icon: 'Layers',
    sections: [
      {
        heading: "Why RGB isn't perceptually uniform",
        body: 'Equal numeric steps in RGB or HSL do not correspond to equal perceived steps in color — some hue ranges look like they change drastically with a small shift, others barely move. This makes RGB unreliable for tasks like generating evenly-spaced color scales.',
      },
      {
        heading: 'LAB and LCH',
        body: 'CIELAB was designed to be device-independent and to approximate human visual perception, with L for lightness and a/b for two color-opponent axes. LCH re-expresses the same space in cylindrical, hue-friendly coordinates — much like HSL does for RGB.',
      },
      {
        heading: 'OKLab and OKLCH',
        body: 'OKLab is a newer space designed to fix known distortions in CIELAB, offering better perceptual uniformity. OKLCH, its cylindrical form, is now supported directly in CSS `color()` syntax and is increasingly the preferred choice for building accessible, evenly-spaced color scales.',
      },
    ],
    quiz: [
      {
        id: 'pc-1',
        question: 'Why was LAB color space created?',
        options: [
          'To save file size',
          'To model human visual perception independent of device',
          'To replace RGB for screens',
          'For print only',
        ],
        correctIndex: 1,
        explanation: 'LAB was designed to be device-independent and to approximate how humans actually perceive color differences.',
      },
      {
        id: 'pc-2',
        question: 'OKLCH is best described as...',
        options: [
          'An older model rarely used today',
          'A perceptually uniform space gaining support in modern CSS',
          'Only relevant for print',
          'Identical to HSL',
        ],
        correctIndex: 1,
        explanation: 'OKLCH is a modern, perceptually uniform color space now directly supported in CSS color syntax.',
      },
      {
        id: 'pc-3',
        question: 'A key advantage of perceptually uniform spaces is...',
        options: [
          'Equal numeric steps look like equal visual steps',
          'They use less memory',
          'They only work for grayscale',
          'They eliminate the need for color profiles',
        ],
        correctIndex: 0,
        explanation: 'Perceptual uniformity means a fixed numeric change produces a visually consistent change, which is ideal for generating scales and gradients.',
      },
    ],
  },
];
