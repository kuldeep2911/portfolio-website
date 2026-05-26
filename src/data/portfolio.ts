// ─────────────────────────────────────────────
// Portfolio Data — Kuldeep Kumar · AI/ML Engineer
// ─────────────────────────────────────────────

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  tags: string[]
  category: 'ml' | 'nlp' | 'cv' | 'llm' | 'data'
  status: 'production' | 'research' | 'open-source'
  metrics?: { label: string; value: string }[]
  githubUrl?: string
  demoUrl?: string
  paperUrl?: string
  featured: boolean
  year: number
}

export interface Experience {
  id: string
  company: string
  role: string
  duration: string
  startDate: string
  endDate: string | null
  description: string[]
  technologies: string[]
  type: 'full-time' | 'contract' | 'internship' | 'freelance'
}

export interface Skill {
  category: string
  icon: string
  items: {
    name: string
    proficiency: number // 0–100
  }[]
}

export interface Publication {
  id: string
  title: string
  venue: string
  year: number
  authors: string[]
  abstract: string
  tags: string[]
  paperUrl?: string
  citationCount?: number
}

export interface SocialLink {
  platform: string
  url: string
  handle: string
}

// ─── Profile ─────────────────────────────────
export const profile = {
  name: 'Kuldeep Kumar',
  title: 'AI/ML Engineer',
  tagline: 'Building intelligent systems that learn, reason, and create.',
  bio: `I'm an AI/ML Engineer with a passion for building production-grade intelligent systems.
  My work spans large language models, computer vision, and data-intensive ML pipelines.
  I love the full spectrum — from research and experimentation to deploying scalable, 
  reliable models that actually make a difference.`,
  location: 'India',
  email: 'kuldeep@example.com',
  availableForWork: true,
  yearsOfExperience: 4,
  projectsCompleted: 30,
  modelsDeployed: 12,
}

// ─── Social Links ─────────────────────────────
export const socialLinks: SocialLink[] = [
  { platform: 'GitHub',   url: 'https://github.com/kuldeepkumar',   handle: '@kuldeepkumar' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/kuldeepkumar', handle: 'Kuldeep Kumar' },
  { platform: 'Twitter',  url: 'https://twitter.com/kuldeepkumar',  handle: '@kuldeepkumar' },
  { platform: 'HuggingFace', url: 'https://huggingface.co/kuldeepkumar', handle: 'kuldeepkumar' },
]

// ─── Projects ─────────────────────────────────
export const projects: Project[] = [
  {
    id: 'rag-enterprise',
    title: 'Enterprise RAG Pipeline',
    description: 'Production-grade Retrieval-Augmented Generation system serving 10K+ daily queries with sub-200ms latency.',
    longDescription: `Built a fully production-hardened RAG pipeline using LangChain, Pinecone, and GPT-4. 
    Implemented hybrid retrieval combining dense embeddings (text-embedding-ada-002) and BM25 sparse 
    retrieval for maximum recall. Deployed on Kubernetes with auto-scaling, achieving 99.9% uptime.`,
    tags: ['LangChain', 'OpenAI', 'Pinecone', 'FastAPI', 'Kubernetes', 'Redis'],
    category: 'llm',
    status: 'production',
    metrics: [
      { label: 'Daily Queries', value: '10K+' },
      { label: 'Latency P95', value: '<200ms' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Accuracy', value: '94.2%' },
    ],
    githubUrl: 'https://github.com/kuldeepkumar/enterprise-rag',
    featured: true,
    year: 2024,
  },
  {
    id: 'vision-defect-detection',
    title: 'Industrial Defect Detection',
    description: 'Real-time CV system detecting manufacturing defects with 98.7% precision on edge hardware.',
    longDescription: `Developed a YOLO-v8-based defect detection system for PCB inspection. 
    Trained on a custom dataset of 50K annotated images. Optimised with TensorRT for 
    NVIDIA Jetson deployment, achieving 47 FPS real-time inference with 98.7% precision.`,
    tags: ['YOLOv8', 'TensorRT', 'OpenCV', 'Python', 'NVIDIA Jetson', 'PyTorch'],
    category: 'cv',
    status: 'production',
    metrics: [
      { label: 'Precision', value: '98.7%' },
      { label: 'Inference Speed', value: '47 FPS' },
      { label: 'Training Images', value: '50K' },
      { label: 'Defect Classes', value: '14' },
    ],
    githubUrl: 'https://github.com/kuldeepkumar/defect-detection',
    featured: true,
    year: 2024,
  },
  {
    id: 'llm-finetuning-framework',
    title: 'LLM Fine-tuning Framework',
    description: 'Open-source toolkit for efficient LLM fine-tuning using LoRA/QLoRA with experiment tracking.',
    longDescription: `Created a modular fine-tuning framework supporting Llama 3, Mistral, and Phi-3. 
    Integrates Weights & Biases for experiment tracking, supports 4-bit quantisation via bitsandbytes, 
    and includes a hyperparameter optimisation loop using Optuna. Reduced fine-tuning cost by 60% vs full-parameter approaches.`,
    tags: ['PyTorch', 'HuggingFace', 'LoRA', 'QLoRA', 'W&B', 'Optuna', 'CUDA'],
    category: 'llm',
    status: 'open-source',
    metrics: [
      { label: 'Cost Reduction', value: '60%' },
      { label: 'GitHub Stars', value: '1.2K' },
      { label: 'Models Supported', value: '15+' },
    ],
    githubUrl: 'https://github.com/kuldeepkumar/llm-finetune-kit',
    featured: true,
    year: 2024,
  },
  {
    id: 'multimodal-search',
    title: 'Multimodal Semantic Search',
    description: 'CLIP-powered image + text search engine with sub-100ms retrieval across 1M+ items.',
    longDescription: `Built a unified multimodal search engine using OpenAI CLIP for joint image-text embeddings.
    Indexed 1M+ product images and descriptions using FAISS with IVF-PQ compression. 
    Exposed via a FastAPI backend with streaming SSE results and a Next.js frontend.`,
    tags: ['CLIP', 'FAISS', 'FastAPI', 'Next.js', 'PostgreSQL', 'Docker'],
    category: 'cv',
    status: 'production',
    metrics: [
      { label: 'Index Size', value: '1M+ items' },
      { label: 'Search Latency', value: '<100ms' },
    ],
    githubUrl: 'https://github.com/kuldeepkumar/multimodal-search',
    demoUrl: 'https://multimodal-search-demo.vercel.app',
    featured: false,
    year: 2023,
  },
  {
    id: 'sentiment-analysis-api',
    title: 'Sentiment Analysis API',
    description: 'Fine-tuned DeBERTa model achieving SOTA sentiment classification on finance + social media text.',
    longDescription: `Fine-tuned Microsoft DeBERTa-v3-large on a curated mix of financial news 
    and social media posts. Achieved F1 of 0.932 on FinancialPhraseBank benchmark. 
    Deployed as a scalable REST API on AWS Lambda + API Gateway.`,
    tags: ['DeBERTa', 'HuggingFace', 'AWS Lambda', 'Serverless', 'NLP'],
    category: 'nlp',
    status: 'production',
    metrics: [
      { label: 'F1 Score', value: '0.932' },
      { label: 'Inference', value: '~45ms' },
    ],
    githubUrl: 'https://github.com/kuldeepkumar/sentiment-api',
    featured: false,
    year: 2023,
  },
  {
    id: 'ml-ops-platform',
    title: 'Lightweight MLOps Platform',
    description: 'Self-hosted ML experiment tracker, model registry, and deployment dashboard.',
    longDescription: `Built a lightweight MLOps platform with experiment tracking, model versioning, 
    and one-click deployment to cloud endpoints. Features a React dashboard, FastAPI backend, 
    and integration with MLflow under the hood. Designed for small teams that need MLOps without the Databricks price tag.`,
    tags: ['MLflow', 'FastAPI', 'React', 'Docker', 'PostgreSQL', 'Prometheus'],
    category: 'ml',
    status: 'open-source',
    metrics: [
      { label: 'GitHub Stars', value: '340' },
      { label: 'Active Teams', value: '20+' },
    ],
    githubUrl: 'https://github.com/kuldeepkumar/mlops-lite',
    featured: false,
    year: 2023,
  },
]

// ─── Experience ───────────────────────────────
export const experience: Experience[] = [
  {
    id: 'sr-ml-engineer',
    company: 'Stealth AI Startup',
    role: 'Senior ML Engineer',
    duration: '1 yr 6 mos',
    startDate: '2023-01',
    endDate: null,
    description: [
      'Designed and shipped the core RAG pipeline handling 10K+ daily queries with <200ms p95 latency.',
      'Led LLM evaluation framework using LangSmith, reducing regression rate by 40%.',
      'Architected model versioning system supporting rollback in under 2 minutes.',
      'Mentored 2 junior ML engineers and drove internal knowledge-sharing sessions.',
    ],
    technologies: ['Python', 'LangChain', 'OpenAI', 'Pinecone', 'FastAPI', 'Kubernetes', 'GCP'],
    type: 'full-time',
  },
  {
    id: 'ml-engineer-cv',
    company: 'Manufacturing Tech Co.',
    role: 'ML Engineer — Computer Vision',
    duration: '1 yr 2 mos',
    startDate: '2022-01',
    endDate: '2023-01',
    description: [
      'Delivered defect detection system reducing false negatives by 35% over legacy rule-based system.',
      'Optimised YOLOv8 inference pipeline for NVIDIA Jetson; achieved 47 FPS from 12 FPS baseline.',
      'Managed data annotation pipeline for 50K+ image training set using Label Studio.',
      'Integrated CI/CD for model retraining triggered by data drift alerts.',
    ],
    technologies: ['PyTorch', 'YOLOv8', 'TensorRT', 'OpenCV', 'Label Studio', 'Python', 'MLflow'],
    type: 'full-time',
  },
  {
    id: 'ml-intern',
    company: 'NLP Research Lab',
    role: 'ML Research Intern',
    duration: '6 mos',
    startDate: '2021-06',
    endDate: '2021-12',
    description: [
      'Contributed to research on efficient transformer attention mechanisms.',
      'Implemented custom attention variants in PyTorch and benchmarked vs baseline BERT.',
      'Assisted in writing two internal research reports on sparse attention patterns.',
    ],
    technologies: ['PyTorch', 'HuggingFace Transformers', 'Python', 'CUDA', 'W&B'],
    type: 'internship',
  },
]

// ─── Skills ───────────────────────────────────
export const skills: Skill[] = [
  {
    category: 'ML & Deep Learning',
    icon: 'Brain',
    items: [
      { name: 'PyTorch',        proficiency: 95 },
      { name: 'TensorFlow',     proficiency: 80 },
      { name: 'Scikit-Learn',   proficiency: 90 },
      { name: 'JAX',            proficiency: 65 },
      { name: 'CUDA / Triton',  proficiency: 70 },
    ],
  },
  {
    category: 'LLMs & NLP',
    icon: 'MessageSquare',
    items: [
      { name: 'LangChain',      proficiency: 92 },
      { name: 'HuggingFace',    proficiency: 95 },
      { name: 'OpenAI API',     proficiency: 90 },
      { name: 'LlamaIndex',     proficiency: 80 },
      { name: 'PEFT / LoRA',    proficiency: 85 },
    ],
  },
  {
    category: 'Computer Vision',
    icon: 'Eye',
    items: [
      { name: 'OpenCV',         proficiency: 88 },
      { name: 'YOLO series',    proficiency: 90 },
      { name: 'CLIP',           proficiency: 82 },
      { name: 'TensorRT',       proficiency: 75 },
      { name: 'Albumentations', proficiency: 85 },
    ],
  },
  {
    category: 'MLOps & Infra',
    icon: 'Server',
    items: [
      { name: 'Docker / K8s',   proficiency: 85 },
      { name: 'MLflow',         proficiency: 88 },
      { name: 'GCP / AWS',      proficiency: 80 },
      { name: 'FastAPI',        proficiency: 90 },
      { name: 'Prometheus',     proficiency: 70 },
    ],
  },
  {
    category: 'Data Engineering',
    icon: 'Database',
    items: [
      { name: 'Spark / PySpark',proficiency: 75 },
      { name: 'Pandas / Polars',proficiency: 92 },
      { name: 'PostgreSQL',     proficiency: 82 },
      { name: 'Pinecone',       proficiency: 85 },
      { name: 'dbt',            proficiency: 68 },
    ],
  },
]

// ─── Navigation ───────────────────────────────
export const navLinks = [
  { label: 'About',      href: '#about' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Contact',    href: '#contact' },
]
