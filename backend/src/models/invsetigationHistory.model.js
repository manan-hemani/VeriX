import mongoose from "mongoose";

const subclaimSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "SUPPORTED",
        "CONTRADICTED",
        "PARTIALLY_SUPPORTED",
        "UNCERTAIN",
        "UNVERIFIED",
      ],
      default: "UNCERTAIN",
    },
  },
  { _id: false },
);

const evidenceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    title: String,

    source: String,

    url: String,

    publishedDate: String,

    relationship: {
      type: String,
      enum: [
        "SUPPORTS",
        "CONTRADICTS",
        "PARTIALLY_SUPPORTS",
        "UNCERTAIN",
        "IRRELEVANT",
      ],
    },

    summary: String,

    limitations: String,
  },
  { _id: false },
);

const searchSchema = new mongoose.Schema(
  {
    query: String,

    type: String,

    resultsFound: Number,
  },
  { _id: false },
);

const investigationSchema = new mongoose.Schema(
  {
    investigationId: {
      type: String,
      required: true,
      unique: true,
    },

    claim: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "SUPPORTED",
        "CONTRADICTED",
        "PARTIALLY_SUPPORTED",
        "UNCERTAIN",
        "UNVERIFIED",
      ],
      default: "UNCERTAIN",
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100,
    },

    confidenceLabel: String,

    evidenceSummary: String,

    sourcesCount: {
      type: Number,
      default: 0,
    },

    subclaimsCount: {
      type: Number,
      default: 0,
    },

    searchesCount: {
      type: Number,
      default: 0,
    },

    searchType: {
      type: String,
      default: "Multi-Hop",
    },

    tags: [String],

    cycle: {
      current: {
        type: Number,
        default: 0,
      },

      max: {
        type: Number,
        default: 5,
      },
    },

    subclaims: [subclaimSchema],

    evidence: [evidenceSchema],

    searches: [searchSchema],

    contradictions: [
      {
        description: String,
        evidenceIds: [String],
      },
    ],

    evidenceGaps: [String],

    graph: {
      nodes: {
        type: Array,
        default: [],
      },

      edges: {
        type: Array,
        default: [],
      },
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("Investigation", investigationSchema);
