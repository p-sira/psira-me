export const CONFIG = {
    ORCID_ID: "0000-0002-5636-8870",
    BORDER_COLORS: ["accent-primary", "accent-secondary", "accent-tertiary"],
    WORK_TYPE_MAPPINGS: {
        publications: [
            "journal-article", "journal-issue", "book", "book-chapter",
            "book-review", "dictionary-entry", "encyclopedia-entry",
            "edited-book", "monograph", "report", "review",
            "review-article", "manual", "other"
        ],
        conferences: [
            "conference-paper", "conference-poster", "conference-abstract",
            "conference-presentation", "lecture-speech", "data-set", "dissertation-thesis"
        ],
        services: []
    }
};

export const ORCID_URL = `https://pub.orcid.org/v3.0/${CONFIG.ORCID_ID}/works`;
