/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

export const data_local =
  {
    HOME: {
      TITLE: "My Assessments",
      BUTTON: "Create Assessment",
      BUTTON_TOOLTIP: "Click to create new assessment",
      ASSESSMENT_TOOLTIP: "Click to view details of ",
      SORTING_TOOLTIP: "Click to sort on ",
      TABLE_HEADING: {
        ASSESSMENT_NAME: "Assessment Name",
        ORGANISATION_NAME: "Organisation Name",
        STATUS: "Status",
        LAST_UPDATED: "Last Updated"
      },
      ERROR_MESSAGE: {
        ASSESSMENT_UNAVAILABLE: "No Assessments Found."
      }
    },
    SEARCH: {
      SEARCH_BAR_TEXT: "Search"
    },
    ASSESSMENT: {
      CREATE: {
        TITLE: "Create Assessment",
        TOOLTIP: "Click to create new assessment",
        BUTTON_TEXT: "Save"
      },
      MANAGE: {
        TITLE: "Configure",
        TOOLTIP: "Click to update this assessment",
        BUTTON_TEXT: "Update"
      },
      CLOSE: {
        TOOLTIP_MESSAGE: "Click to close the dialog box"
      },
      MANDATORY_FIELD_TEXT: "Mandatory field",
      ORGANISATION_VALIDATOR_MESSAGE: "Organisation not Found",
      ERROR_MESSAGE_TEXT: "Only special characters allowed are [ _ & . , : - ]",
      ASSESSMENT_NAME: {
        TITLE: "Assessment Name",
        PLACEHOLDER: "Enter Assessment Name",
        PURPOSE: {
          TITLE: "Assessment Request Type",
        }
      },
      ASSESSMENT_DESCRIPTION:{
        TITLE: "Description for Assessment",
        PLACEHOLDER: "Enter Description of Assessment",
        LIMIT:200,
        BLANK_SPACE_ERROR_TEXT: "No blank spaces are allowed"
      },
      ASSESSMENT_DOMAIN: {
        TITLE: "Domain of Target",
        PLACEHOLDER: "Enter Domain of Target"
      },
      ASSESSMENT_TEAM: {
        TITLE: "Size of Target Team",
        PLACEHOLDER: "Enter Team size",
        MANDATORY_FIELD_NUMBER: "Mandatory number field",
        ERROR_MESSAGE_NUMBER: "Positive integer value allowed",
        TEAM_SIZE_EXCEED: "Value should not exceed 10000000",
        MAX_TEAM_SIZE: 10000000
      },
      ORGANISATION_NAME: {
        TITLE: "Organisation Name",
        PLACEHOLDER: "Enter Organisation Name"
      },
      ORGANISATION_INDUSTRY: {
        TITLE: "Industry of Organisation",
        PLACEHOLDER: "Enter Industry of Organisation"
      },
      ADD_ASSESSMENT_USERS: "Grant Access",
      USER_EMAIL: {
        TITLE: "Email",
        PLACEHOLDER: "abc@thoughtworks.com",
        ERROR_MESSAGE: "Valid list of comma separated thoughtworks.com email address",
        LIMIT_REACHED: "Maximum users limit reached : "
      },
      FILL_ALL_FIELDS_ERROR_MESSAGE: "Please fill in all the required fields correctly",
      SERVER_ERROR_MESSAGE: "Server Error."
    },
    ASSESSMENT_MENU: {
      GENERATE_REPORT: {
        TITLE: "Generate Report",
        TOOLTIP: "Click to generate report"
      },
      FINISH_ASSESSMENT: {
        TITLE: "Finish Assessment",
        TOOLTIP: "Click to finish assessment"
      },
      REOPEN_ASSESSMENT: {
        TITLE: "Reopen Assessment",
        TOOLTIP: "Click to reopen assessment"
      },
      MENU_BUTTON: {
        TOOLTIP: "Click to open menu"
      },
      MANAGE_ASSESSMENT: {
        TITLE: "Configure",
        TOOLTIP: "Click to manage assessment and users"
      },
      ADD_ASSESSMENT_MODULE: {
        TITLE: "Manage modules",
        TOOLTIP: "Click to select category/modules"
      },
      DELETE_ASSESSMENT: {
        TITLE: "Delete assessment",
        TOOLTIP: "Click to delete assessment",
        DIALOG: "Assessment will be deleted, Are you sure ?",
        ERROR_MESSAGE: "Error in deleting assessment"
      },
      CONFIRMATION_POPUP_TEXT: "Are you sure? You will not be able to edit assessment again without reopening it.",
      LAST_SAVE_STATUS_TEXT: "Last saved at ",
      IN_PROGRESS_REPORT_DOWNLOADING_MESSAGE: "Assessment report is getting downloaded.",
      COMPLETE_REPORT_DOWNLOADING_MESSAGE: "Assessment report & report template are getting downloaded, Please allow multiple download option.",
      REPORT_TEMPLATE_NAME: "Tech_Due_Diligence_Report_Sample.docx",
      GO_BACK: "Go back",
    },
    TOPIC_AVERAGE_RATING: {
      TITLE: "Computed Maturity Score"
    },
    ASSESSMENT_CATEGORY: {
      TITLE: "Categories",
      SAVE: "Click to save modules",
      CATEGORY_CONTENT: "Select the modules that are in scope for the assessment and click on ‘Save’ to proceed",
      CATEGORY: "Category",
    },
    ASSESSMENT_QUESTION_FIELD: {
      LABEL: "Notes",
      ANSWER_FIELD_LIMIT : 10000
    },
    ERROR_MESSAGE_LINK_TEXT: {
      HOMEPAGE_LINK_TEXT: "Homepage",
      RETRY_TEXT: "Retry"
    },
    HEADER_LINK_TEXT: {
      MICRO_SITE: "Micro-site",
      SUPPORT: "Support",
      FEEDBACK: "Feedback",
      LOGOUT: "Log Out",
      ADMIN_CONSOLE: "Admin-Console",
      CONTRIBUTOR: "Contributor"
    },
    ASSESSMENT_PARAMETER: {
      MATURITY_SCORE_TITLE: "Assign Maturity score - ",
      RECOMMENDATION_LABEL: "Recommendations"
    },
    POPUP_BUTTON: {
      BUTTON_TEXT: "Yes"
    },
    ASSESSMENT_TOPIC: {
      MATURITY_SCORE_TITLE: "Assign Maturity score - ",
      RECOMMENDATION_LABEL: "Recommendations"
    },
    COPYRIGHT_MESSAGE: {
      COPYRIGHT_TEXT: "Copyright (c) 2022 -",
      THOUGHTWORKS_TAG: "Thoughtworks Inc.",
      RIGHTS_RESERVED_TEXT: "All rights reserved. v"
    },
    LEGAL_WARNING_MSG_FOR_INPUT: " (Never enter passwords or other confidential information in your notes or recommendations)",
    SUMMARY_REPORT: {
      TITLE: "Summary",
      TOOLTIP: "Click to View Chart Summary",
      DOWNLOAD_ACTION_TOOLTIP: "Click to download this chart as PNG image.",
      DOWNLOAD_NOTIFICATION:"Downloading ... It may take some time, Please stay on same page.",
      INSTRUCTION: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et\n" +
        "      dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita\n" +
        "      kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
      MODULE_ASSESSED: "Modules Assessed",
      CATEGORY_ASSESSED: "Categories Assessed",
      TOPIC_ASSESSED: "Topics Assessed",
      PARAMETER_ASSESSED: "Parameters Assessed",
      QUESTION_ANSWERED: "Questions Answered",
      NO_DATA_AVAILABLE: "No rating data available to display the chart",
      COLOUR_THEME_HEADING: "Select Color Theme",
      ROADMAP_CHART : {
        TITLE : "Investment Roadmap",
        NO_RECOMMENDATION_MESSAGE: "No Recommendations are available to display",
        LEGEND_TITLE: "Category"

      },
      RECOMMENDATION : {
        TITLE : "Recommendations",
        HEADING : "Recommendation #"
      }
    },
    ADMIN: {
      CONSOLE : {
        CONSOLE_TEXT : "Admin Console",
        DASHBOARD: "Dashboard",
        CATEGORY: "Category",
        MODULE: "Module",
        TOPIC: "Topic",
        PARAMETER: "Parameter",
        MANAGE_USERS: "Manage Users"

      },
      ROLE : {
        ADMIN : "admin", PRIMARY:{ROLE_VALUE: 'Primary', DISPLAY_VALUE: 'PRIMARY_ADMIN',
          DISPLAY_TEXT: 'Primary Admin'
        },
        SECONDARY: {
          ROLE_VALUE:'Secondary',
          DISPLAY_VALUE: 'SECONDARY_ADMIN',
          DISPLAY_TEXT: 'SECONDARY_ADMIN'
        }

      },
      MODULE_NOT_FOUND: "No modules available",
      DATA_NOT_FOUND: "No data matching the filter",
      SERVER_ERROR_MESSAGE: "Some error occurred",
      UPDATE_SUCCESSFUL_MESSAGE: "Your changes have been successfully updated.",
      INPUT_ERROR_MESSAGE: "Please fill the field",
      CATEGORY_NAME: "Category",
      MODULE_NAME: "Module",
      TOPIC_NAME: "Topic",
      PARAMETER_NAME: "Parameter",
      DATE: "Date",
      ACTIVE: "Active",
      ACTION: "Action",
      EDIT: "Edit",
      SAVE: "Save",
      UPDATE: "Update",
      DUPLICATE_ERROR_MESSAGE: "Duplicate names are not allowed",
      CATEGORY_SELECTION_LABEL: "Select category",
      MODULE_SELECTION_LABEL: "Select Module",
      CATEGORY: {
        SELECT_CATEGORY: "Select Category",
        ADD_CATEGORY: "Add Category",
        PLACEHOLDER: "Enter Category name"

      },
      MODULE: {
        ADD_MODULE: "Add Module",
        SELECT_MODULE: "Select Module",
        MODULE_INPUT_TEXT: "Enter Module Name", CONTRIBUTORS: "Contributors"

      },
      TOPIC: {
        ADD_TOPIC: "Add Topic",
        ENTER_TOPIC: "Enter topic name",
      },
      PARAMETER: {
        TOPIC_SELECTION_LABEL: "Select Topic",
        PARAMETER_INPUT_TEXT: "Enter Parameter Name",
        TOPIC_NOT_FOUND: "Topic Not Found",
      },
      REFERENCES: {
        HEADER: "References - ",
        SCORE_CARD: "Maturity Reference Score Card",
        ADD_REFERENCE_BUTTON: "Add Maturity Reference",
        PARAMETER_REFERENCE_MESSAGE: "References can't be added because Parameter Level References already exists!",
        TOPIC_REFERENCE_MESSAGE: "References can't be added because Topic Level References already exists!",
        DATA_NOT_SAVED: "Data cannot be saved, Please reload the page if problem persist.",
        DUPLICATE_RATING_ERROR_MESSAGE: "No duplicate ratings are allowed",
        DUPLICATE_REFERENCE_ERROR_MESSAGE: "No duplicate references are allowed",
        ADMIN_PARAMETER_REFERENCE_MESSAGE: "References can't be shown because parameter Level References already exists! ",
        ADMIN_TOPIC_REFERENCE_MESSAGE:"References can't be shown because topic Level References already exists! ",

      },
      DASHBOARD: {
        TOTAL_ASSESSMENT: "Total Assessments",
        TOTAL_ACTIVE: "Assessments in Progress",
        TOTAL_COMPLETE: "Completed Assessments",
        DOWNLOAD_REPORT: "Download Report",
        DASHBOARD_TITLE: "Dashboard",
        DOWNLOAD_REPORT_LABEL: "Click to download report",
        DROPDOWN_LABEL: "Click to select the days range",
        ERROR_MESSAGE: "Error in processing request.",
        APPLY_BUTTON_TEXT: "Apply",
        TOTAL_SUBTEXT: "Total:",
        CUSTOM_DATE_ERROR_MESSAGE: "Select a date range within 2 years"
      },
      QUESTION: {
        ADD_QUESTION: " Add Question",
        QUESTIONS: "Questions",
        QUESTION: "Question",
        REQUIRED_FIELD: "This field is required"

      }, MANAGE_ADMIN: {
        INVALID_AUTOCOMPLETE_VALIDATION: 'invalidAutocompleteString', REQUIRED_FIELD_VALIDATION: 'required',
        ROLE_ALREADY_PRESENT_VALIDATION: 'roleAlreadyPresent',
        MESSAGE: {
          ROLE_ALREADY_PRESENT: 'User already assigned to a role'
          
        },
        CRITERIA_TEXT: "User should have logged in at least once.",
        INVALID_AUTOCOMPLETE_VALIDATION_MESSAGE: "User Not found"


      }
          
    },
    DROPDOWN_OPTION_TEXT: {
      LAST_WEEK: "Last 7 Days",
      LAST_MONTH: "Last 30 Days",
      LAST_QUARTER: "Last 90 Days",
      LAST_YEAR: "Last 365 Days"
    },
    RECOMMENDATION_TEXT: {
      ADD_RECOMMENDATION : "Add Recommendations",
      DELETE_RECOMMENDATION : "Delete Recommendation",
      IMPACT_LABEL: "Impact",
      EFFORT: "Effort",
      DELIVERY_HORIZON: "Delivery Horizon",
      DELETE: "Delete",
      IMPACT_1: "High",
      IMPACT_2: "Medium",
      IMPACT_3: "Low",
      EFFORT_1:"High",
      EFFORT_2:"Medium",
      EFFORT_3:"Low",
      DH_1: "Now",
      DH_2: "Next",
      DH_3: "Later",
      LIMIT: 5000
    },
    SHOW_ERROR_MESSAGE: {
      POPUP_ERROR: "Data cannot be saved, Please reload the page if problem persist.",
      MENU_ERROR: "Error occurred while saving the data",
      DELETE_ERROR : "Data cannot be deleted"
    },
    ADDITIONAL_QUESTIONS: {
      HEADING: "Additional Questions -",
      ADD_QUESTION_TEXT: "Add a New Question",
      QUESTION_FUNCTIONALITY_MESSAGE: {
        EDIT: "Edit",
        UPDATE: "Update",
        SAVE: "Save",
        DELETE: "Delete"
      }
    },
    AUTO_SAVE: {
      AUTO_SAVE_MESSAGE: "Auto Saved"
    },
    QUESTION_TYPE_TEXT: {
      DEFAULT_TYPE: "DEFAULT",
      ADDITIONAL_TYPE: "ADDITIONAL"
    },
    OVERALL_CHART_TEXT: {
      CHART_TITLE: "Current Maturity and Gaps",
      TARGET_RATING_TITLE: "Target Rating Gap",
      CURRENT_RATING_TITLE: "Current Rating"
    },
    RADAR_CHART: {
      CHART_TITLE: "Detailed Findings",
      TARGET_SCORE_LABEL: "Target Score",
      CURRENT_SCORE_LABEL: "Current Score"
    },
    ACTIVITY_TYPE: {
      DEFAULT_QUESTION_TYPE:"DEFAULT_QUESTION",
      ADDITIONAL_QUESTION_TYPE:"ADDITIONAL_QUESTION",
      TOPIC_RECOMMENDATION: "TOPIC_RECOMMENDATION",
      PARAMETER_RECOMMENDATION: "PARAMETER_RECOMMENDATION"

    },
    CONTRIBUTOR : {
      COMMENTS : "Comments",
      SEARCH_TEXT : "Type to search",
      CONSOLE : "Contributor Console",
      CONTRIBUTOR : "Contributor",
      TITLE :"X-Act Contributor",
      ALL_QUESTIONS : "All Questions",
      SELECT_ALL : "Select All",
      SEARCH_QUESTIONS : "Search questions",
      CANCEL : "Cancel",
      CLOSE : "Close",
      EDIT : "Edit",
      SAVE : "Save",
      QUESTIONS : "Questions",
      CONFIRMATION_POPUP_TEXT: "Are you sure",
      APPROVE_QUESTION_CONFIRMATION_POPUP_TEXT : "Do you want to approve the question?",
      NOTIFICATION_MESSAGES : {
        CREATE : "Questions created successfully!",
        APPROVE : "Questions approved successfully!",
        REJECT : "Questions rejected successfully!",
        UPDATE : "Questions updated successfully!",
        SENT_FOR_REVIEW : "Questions sent for review successfully!",
        REQUESTED_FOR_CHANGE : "Questions sent for reassessment successfully!",
      },
      STATUS : {
        DRAFT : "DRAFT",
        SENT_FOR_REVIEW : "SENT_FOR_REVIEW",
        PUBLISHED: "PUBLISHED",
        REQUESTED_FOR_CHANGE : "REQUESTED_FOR_CHANGE",
        REJECTED : "REJECTED",
        DISPLAY_TEXT: {
          SEND_FOR_REASSESSMENT : "Send For Reassessment",
          SENT_FOR_REVIEW: "Sent for Review",
          PUBLISHED_QUESTIONS:'Published Questions',
          REJECTED: 'Rejected',
          DRAFT: 'Draft',
          CHANGE_REQUESTS : 'Change Requests',
          IN_PROGRESS : 'In Progress',
        },
        HOVER_TEXT : {
          APPROVE : 'Approve',
          REJECT : 'Reject',
          REQUESTED_FOR_CHANGE: 'Requested For Change',
        }
      },
      ROLE : {
        AUTHOR : "AUTHOR",
        REVIEWER : "REVIEWER",
        DISPLAY_TEXT : {
          AUTHOR : "Author",
          REVIEWER : "Reviewer",
        },
      },
      AUTHOR : {
        SEND_FOR_REVIEW : "Send for Review",
      },
      NO_DATA_PRESENT: "No Questions available to show at this moment",
      duplicateErrorMessage: "Duplicate email found",
      commonErrorMessage:"Duplicate email found,User can't be both author and reviewer",
      manageText: "Manage Contributors", disableText: 'Contributors can be added only after module creation',
      topicText: "Topic",
      parameterText: "Parameter"

    },
    IDLE_STATE: {
      STATE: {
        NOT_STARTED: "NOT_STARTED",
        IDLE: "IDLE",
        NOT_IDLE: "NOT_IDLE",
        TIMED_OUT: {
          LABEL: "TIMED_OUT",
          PROMPT_BODY: "You have been idle for sometime, Please reload the page to continue working."
        }
      }
    }

  }
