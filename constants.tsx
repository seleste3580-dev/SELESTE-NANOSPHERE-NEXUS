
import { AcademicLevel, Course, Faculty } from './types';

export const PROMPT_SUGGESTIONS = [
  "Enhance CMOS architecture clarity",
  "Apply retro-blueprint schematic filter",
  "Isolate 8085 microprocessor ALU pins",
  "Highlight digital signal conditioning path",
  "Augment PCB trace contrast",
  "Simulate thermal imaging on chip surface"
];

export const ADVISOR_SYSTEM_INSTRUCTION = "You are the Seleste AI Academic Advisor. You represent the elite faculty of the University of Nairobi. Provide clean, professional, and technical responses formatted in high-fidelity academic Markdown.";

export const COURSES: Course[] = [
  // FACULTY OF SCIENCE & TECHNOLOGY
  {
    id: 'uon-micro-001',
    name: 'BSc in Microprocessor Technology and Instrumentation',
    level: AcademicLevel.BACHELOR,
    faculty: Faculty.SCIENCE_TECH,
    university: 'University of Nairobi',
    years: 4,
    lessons: [
      { id: 'uon-mt-101', title: 'Computer Architecture & Organization', code: 'SPM 101', description: 'Internal logic of modern processors.', content: 'Detailed study of 8086 architecture and bus systems.' },
      { id: 'uon-mt-102', title: 'Calculus for Technology I', code: 'SMA 101', description: 'Foundational mathematics for engineering logic.', content: 'Limits, derivatives, and integral calculus applications.' },
      { id: 'uon-mt-201', title: 'Digital Electronics II', code: 'SPM 201', description: 'Advanced sequential logic design.', content: 'Counters, shift registers, and FPGA basics.' },
      { id: 'uon-mt-202', title: 'Data Structures & Algorithms', code: 'SPM 202', description: 'Core programming concepts for microprocessor efficiency.', content: 'Trees, graphs, and search optimization.' },
      { id: 'uon-mt-205', title: 'Electronic Circuits I', code: 'SPM 205', description: 'BJT and FET analysis.', content: 'Biasing, amplification, and small signal modeling.' },
      { id: 'uon-mt-301', title: 'Embedded Systems Design', code: 'SPM 301', description: 'SOC and MCU integration.', content: 'ARM Cortex-M architecture and real-time constraints.' },
      { id: 'uon-mt-305', title: 'Real-time Operating Systems', code: 'SPM 305', description: 'Scheduling algorithms and kernel design.', content: 'Inter-process communication and task management.' },
      { id: 'uon-mt-310', title: 'Digital Signal Processing', code: 'SPM 310', description: 'LTI systems and Z-transforms.', content: 'FIR/IIR filter design and spectral analysis.' },
      { id: 'uon-mt-401', title: 'Microprocessor Interfacing', code: 'SPM 401', description: 'Hardware integration protocols.', content: 'SPI, I2C, UART and high-speed memory mapping.' },
      { id: 'uon-mt-405', title: 'VLSI System Design', code: 'SPM 405', description: 'IC fabrication and CMOS logic.', content: 'Layout design rules and parasitic extraction.' },
      { id: 'uon-mt-410', title: 'Industrial Instrumentation', code: 'SPM 410', description: 'Sensor networks and PLC systems.', content: 'SCADA, telemetry, and industrial bus standards.' },
      { id: 'uon-mt-499', title: 'Final Year Project', code: 'SPM 499', description: 'Autonomous research and design.', content: 'Full-cycle microprocessor-based solution development.' }
    ]
  },
  {
    id: 'uon-physics-001',
    name: 'BSc in Physics',
    level: AcademicLevel.BACHELOR,
    faculty: Faculty.SCIENCE_TECH,
    university: 'University of Nairobi',
    years: 4,
    lessons: [
      { id: 'sph-101', title: 'Mechanics', code: 'SPH 101', description: 'Newtonian principles.', content: 'Vectors, kinetics and dynamics.' },
      { id: 'sph-201', title: 'Waves and Optics', code: 'SPH 201', description: 'Physical optics and wave phenomena.', content: 'Interference, diffraction, and laser physics.' },
      { id: 'sph-301', title: 'Quantum Mechanics I', code: 'SPH 301', description: 'Introductory quantum theory.', content: 'Schrödinger equation and wavefunctions.' }
    ]
  },
  {
    id: 'uon-cs-001',
    name: 'BSc in Computer Science',
    level: AcademicLevel.BACHELOR,
    faculty: Faculty.SCIENCE_TECH,
    university: 'University of Nairobi',
    years: 4,
    lessons: [
      { id: 'ics-101', title: 'Structured Programming', code: 'ICS 101', description: 'Fundamentals of C/C++.', content: 'Logic structures, loops, and memory management.' },
      { id: 'ics-201', title: 'Object Oriented Programming', code: 'ICS 201', description: 'Java and design patterns.', content: 'Inheritance, polymorphism, and abstraction.' },
      { id: 'ics-301', title: 'Database Systems', code: 'ICS 301', description: 'Relational database design.', content: 'SQL, normalization, and transaction management.' }
    ]
  },
  {
    id: 'uon-ds-001',
    name: 'MSc in Data Science',
    level: AcademicLevel.MASTER,
    faculty: Faculty.SCIENCE_TECH,
    university: 'University of Nairobi',
    years: 2,
    lessons: [
      { id: 'ds-501', title: 'Statistical Learning', code: 'CSC 501', description: 'Machine learning foundations.', content: 'Regression, classification, and unsupervised learning.' },
      { id: 'ds-505', title: 'Big Data Analytics', code: 'CSC 505', description: 'Processing exascale datasets.', content: 'Hadoop, Spark, and distributed computing.' }
    ]
  },
  // FACULTY OF ENGINEERING
  {
    id: 'uon-eee-001',
    name: 'BSc in Electrical & Electronic Engineering',
    level: AcademicLevel.BACHELOR,
    faculty: Faculty.ENGINEERING,
    university: 'University of Nairobi',
    years: 5,
    lessons: [
      { id: 'fee-201', title: 'Circuit Theory', code: 'FEE 201', description: 'AC and DC analysis.', content: 'Theorems and network analysis.' },
      { id: 'fee-301', title: 'Electromagnetics', code: 'FEE 301', description: 'Maxwell equations and wave propagation.', content: 'Electrostatics, magnetostatics, and transmission lines.' },
      { id: 'fee-401', title: 'Control Engineering I', code: 'FEE 401', description: 'Feedback system analysis.', content: 'Laplace transforms, root locus, and Bode plots.' }
    ]
  },
  {
    id: 'uon-biomed-001',
    name: 'BSc in Biomedical Engineering',
    level: AcademicLevel.BACHELOR,
    faculty: Faculty.ENGINEERING,
    university: 'University of Nairobi',
    years: 5,
    lessons: [
      { id: 'fbe-301', title: 'Biomedical Instrumentation', code: 'FBE 301', description: 'Medical sensor technology.', content: 'ECG, EEG, and imaging systems hardware.' },
      { id: 'fbe-401', title: 'Biomechanics', code: 'FBE 401', description: 'Human skeletal and muscular mechanics.', content: 'Force analysis and prosthetic design.' }
    ]
  },
  {
    id: 'uon-mech-001',
    name: 'BSc in Mechanical Engineering',
    level: AcademicLevel.BACHELOR,
    faculty: Faculty.ENGINEERING,
    university: 'University of Nairobi',
    years: 5,
    lessons: [
      { id: 'fme-201', title: 'Fluid Mechanics', code: 'FME 201', description: 'Statics and dynamics of fluids.', content: 'Bernoulli, laminar and turbulent flow.' },
      { id: 'fme-301', title: 'Thermodynamics II', code: 'FME 301', description: 'Internal combustion and power cycles.', content: 'Rankine, Otto, and Diesel cycles.' }
    ]
  },
  {
    id: 'uon-civil-001',
    name: 'BSc in Civil Engineering',
    level: AcademicLevel.BACHELOR,
    faculty: Faculty.ENGINEERING,
    university: 'University of Nairobi',
    years: 5,
    lessons: [
      { id: 'fce-201', title: 'Geomatics', code: 'FCE 201', description: 'Surveying and GIS fundamentals.', content: 'Leveling and theodolite operations.' },
      { id: 'fce-301', title: 'Structural Analysis', code: 'FCE 301', description: 'Indeterminate structures.', content: 'Slope-deflection and moment distribution methods.' }
    ]
  },
  // FACULTY OF HEALTH SCIENCES
  {
    id: 'uon-med-001',
    name: 'Bachelor of Medicine & Surgery (MBChB)',
    level: AcademicLevel.BACHELOR,
    faculty: Faculty.HEALTH_SCIENCES,
    university: 'University of Nairobi',
    years: 6,
    lessons: [
      { id: 'hme-101', title: 'Human Anatomy', code: 'HME 101', description: 'Gross and neuro-anatomy.', content: 'Dissection and structural analysis.' },
      { id: 'hme-201', title: 'Medical Biochemistry', code: 'HME 201', description: 'Molecular basis of life.', content: 'Metabolism, enzymes, and clinical genetics.' },
      { id: 'hme-301', title: 'Pathology', code: 'HME 301', description: 'Study of disease processes.', content: 'Cellular injury, inflammation, and neoplasia.' }
    ]
  },
  {
    id: 'uon-pharmacy-001',
    name: 'Bachelor of Pharmacy',
    level: AcademicLevel.BACHELOR,
    faculty: Faculty.HEALTH_SCIENCES,
    university: 'University of Nairobi',
    years: 5,
    lessons: [
      { id: 'uon-pha-101', title: 'Pharmaceutics I', code: 'UPH 101', description: 'Drug delivery systems.', content: 'Dosage forms and formulation science.' },
      { id: 'uon-pha-201', title: 'Pharmacology I', code: 'UPH 201', description: 'Mechanism of drug action.', content: 'Pharmacokinetics and pharmacodynamics.' }
    ]
  },
  {
    id: 'uon-nursing-001',
    name: 'BSc in Nursing',
    level: AcademicLevel.BACHELOR,
    faculty: Faculty.HEALTH_SCIENCES,
    university: 'University of Nairobi',
    years: 4,
    lessons: [
      { id: 'hns-101', title: 'Fundamentals of Nursing', code: 'HNS 101', description: 'Core patient care.', content: 'Ethics and clinical protocols.' },
      { id: 'hns-201', title: 'Medical-Surgical Nursing I', code: 'HNS 201', description: 'Adult healthcare management.', content: 'Perioperative care and chronic conditions.' }
    ]
  },
  // RESEARCH LEVELS
  {
    id: 'uon-phd-nano',
    name: 'PhD in Nano-Electronic Instrumentation',
    level: AcademicLevel.PHD,
    faculty: Faculty.SCIENCE_TECH,
    university: 'University of Nairobi',
    years: 3,
    lessons: [
      { id: 'phd-nano-01', title: 'Advanced Semiconductor Physics', code: 'SPM 701', description: 'Sub-micron device modeling.', content: 'Quantum tunneling and ballistic transport in MOSFETs.' },
      { id: 'phd-nano-02', title: 'Research Methodology', code: 'SPM 702', description: 'Advanced academic inquiry.', content: 'Quantitative methods for physical sciences.' }
    ]
  }
];
