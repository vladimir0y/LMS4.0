/**
 * SCORM 1.2 API Wrapper
 * Lightweight SCORM implementation for legacy SCO content compatibility
 * Supports communication between iframe content and React parent via postMessage
 */

(function() {
  'use strict';

  // SCORM error codes
  const SCORM_ERRORS = {
    NO_ERROR: '0',
    GENERAL_EXCEPTION: '101',
    INVALID_ARGUMENT_ERROR: '201',
    ELEMENT_CANNOT_HAVE_CHILDREN: '202',
    ELEMENT_NOT_AN_ARRAY: '203',
    NOT_INITIALIZED: '301',
    NOT_IMPLEMENTED_ERROR: '401',
    INVALID_SET_VALUE: '402',
    ELEMENT_IS_READ_ONLY: '403',
    ELEMENT_IS_WRITE_ONLY: '404',
    INCORRECT_DATA_TYPE: '405'
  };

  // Data model for SCORM 1.2
  let scormData = {
    'cmi.core._children': 'student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time',
    'cmi.core.student_id': 'student_001',
    'cmi.core.student_name': 'Student',
    'cmi.core.lesson_location': '',
    'cmi.core.credit': 'credit',
    'cmi.core.lesson_status': 'not attempted',
    'cmi.core.entry': 'ab-initio',
    'cmi.core.score._children': 'raw,max,min',
    'cmi.core.score.raw': '',
    'cmi.core.score.max': '100',
    'cmi.core.score.min': '0',
    'cmi.core.total_time': '00:00:00',
    'cmi.core.lesson_mode': 'normal',
    'cmi.core.exit': '',
    'cmi.core.session_time': '00:00:00',
    'cmi.suspend_data': '',
    'cmi.launch_data': '',
    'cmi.comments': '',
    'cmi.comments_from_lms': '',
    'cmi.objectives._count': '0',
    'cmi.student_data._children': 'mastery_score,max_time_allowed,time_limit_action',
    'cmi.student_data.mastery_score': '',
    'cmi.student_data.max_time_allowed': '',
    'cmi.student_data.time_limit_action': '',
    'cmi.student_preference._children': 'audio,language,speed,text',
    'cmi.student_preference.audio': '0',
    'cmi.student_preference.language': '',
    'cmi.student_preference.speed': '0',
    'cmi.student_preference.text': '0',
    'cmi.interactions._count': '0'
  };

  let lastError = SCORM_ERRORS.NO_ERROR;
  let initialized = false;
  let terminated = false;
  let startTime = null;

  // Helper function to calculate session time
  function calculateSessionTime() {
    if (!startTime) return '00:00:00';
    
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    
    return [hours, minutes, seconds]
      .map(n => n.toString().padStart(2, '0'))
      .join(':');
  }

  // Helper function to send data to parent window
  function sendToParent(eventType, data) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'scorm-event',
          eventType: eventType,
          data: data
        }, '*');
      }
    } catch (error) {
      console.warn('Failed to send message to parent:', error);
    }
  }

  // SCORM API Implementation
  const API = {
    /**
     * Initialize the SCORM session
     */
    LMSInitialize: function(parameter) {
      if (parameter !== '' && parameter !== null) {
        lastError = SCORM_ERRORS.INVALID_ARGUMENT_ERROR;
        return 'false';
      }

      if (initialized) {
        lastError = SCORM_ERRORS.GENERAL_EXCEPTION;
        return 'false';
      }

      initialized = true;
      terminated = false;
      startTime = new Date();
      lastError = SCORM_ERRORS.NO_ERROR;

      // Notify parent that SCORM session has initialized
      sendToParent('initialize', {
        timestamp: startTime.toISOString()
      });

      console.log('SCORM: Initialized');
      return 'true';
    },

    /**
     * Terminate the SCORM session
     */
    LMSFinish: function(parameter) {
      if (parameter !== '' && parameter !== null) {
        lastError = SCORM_ERRORS.INVALID_ARGUMENT_ERROR;
        return 'false';
      }

      if (!initialized || terminated) {
        lastError = SCORM_ERRORS.NOT_INITIALIZED;
        return 'false';
      }

      // Update session time before finishing
      scormData['cmi.core.session_time'] = calculateSessionTime();

      terminated = true;
      lastError = SCORM_ERRORS.NO_ERROR;

      // Notify parent that SCORM session has finished
      sendToParent('finish', {
        sessionTime: scormData['cmi.core.session_time'],
        lessonStatus: scormData['cmi.core.lesson_status'],
        score: scormData['cmi.core.score.raw'],
        suspendData: scormData['cmi.suspend_data']
      });

      console.log('SCORM: Finished');
      return 'true';
    },

    /**
     * Get a value from the SCORM data model
     */
    LMSGetValue: function(element) {
      if (!initialized || terminated) {
        lastError = SCORM_ERRORS.NOT_INITIALIZED;
        return '';
      }

      if (element === null || element === undefined) {
        lastError = SCORM_ERRORS.INVALID_ARGUMENT_ERROR;
        return '';
      }

      lastError = SCORM_ERRORS.NO_ERROR;

      // Handle dynamic session time
      if (element === 'cmi.core.session_time') {
        return calculateSessionTime();
      }

      const value = scormData[element];
      if (value === undefined) {
        lastError = SCORM_ERRORS.GENERAL_EXCEPTION;
        return '';
      }

      return value;
    },

    /**
     * Set a value in the SCORM data model
     */
    LMSSetValue: function(element, value) {
      if (!initialized || terminated) {
        lastError = SCORM_ERRORS.NOT_INITIALIZED;
        return 'false';
      }

      if (element === null || element === undefined || value === null || value === undefined) {
        lastError = SCORM_ERRORS.INVALID_ARGUMENT_ERROR;
        return 'false';
      }

      // Validate element exists in data model
      if (!(element in scormData)) {
        lastError = SCORM_ERRORS.GENERAL_EXCEPTION;
        return 'false';
      }

      // Check for read-only elements
      const readOnlyElements = [
        'cmi.core._children',
        'cmi.core.student_id',
        'cmi.core.student_name',
        'cmi.core.credit',
        'cmi.core.entry',
        'cmi.core.lesson_mode',
        'cmi.core.score._children',
        'cmi.student_data._children',
        'cmi.student_preference._children'
      ];

      if (readOnlyElements.includes(element)) {
        lastError = SCORM_ERRORS.ELEMENT_IS_READ_ONLY;
        return 'false';
      }

      // Set the value
      scormData[element] = value;
      lastError = SCORM_ERRORS.NO_ERROR;

      // Handle special elements
      if (element === 'cmi.core.lesson_status') {
        if (value === 'completed' || value === 'passed') {
          sendToParent('complete', {
            lessonStatus: value,
            score: scormData['cmi.core.score.raw'],
            suspendData: scormData['cmi.suspend_data'],
            sessionTime: calculateSessionTime()
          });
        }
      }

      // Notify parent of data change
      sendToParent('datachange', {
        element: element,
        value: value
      });

      return 'true';
    },

    /**
     * Commit data to the LMS
     */
    LMSCommit: function(parameter) {
      if (parameter !== '' && parameter !== null) {
        lastError = SCORM_ERRORS.INVALID_ARGUMENT_ERROR;
        return 'false';
      }

      if (!initialized || terminated) {
        lastError = SCORM_ERRORS.NOT_INITIALIZED;
        return 'false';
      }

      lastError = SCORM_ERRORS.NO_ERROR;

      // Notify parent to commit data
      sendToParent('commit', {
        data: scormData,
        sessionTime: calculateSessionTime()
      });

      console.log('SCORM: Data committed');
      return 'true';
    },

    /**
     * Get the last error code
     */
    LMSGetLastError: function() {
      return lastError;
    },

    /**
     * Get error string for error code
     */
    LMSGetErrorString: function(errorCode) {
      const errorMessages = {
        '0': 'No error',
        '101': 'General exception',
        '201': 'Invalid argument error',
        '202': 'Element cannot have children',
        '203': 'Element not an array',
        '301': 'Not initialized',
        '401': 'Not implemented error',
        '402': 'Invalid set value',
        '403': 'Element is read only',
        '404': 'Element is write only',
        '405': 'Incorrect data type'
      };

      return errorMessages[errorCode] || 'Unknown error';
    },

    /**
     * Get diagnostic information
     */
    LMSGetDiagnostic: function(errorCode) {
      return this.LMSGetErrorString(errorCode);
    }
  };

  // Make API available globally
  if (typeof window !== 'undefined') {
    window.API = API;
    window.API_1484_11 = API; // SCORM 2004 compatibility

    console.log('SCORM API initialized and available globally');

    // Initialize automatically if we're in an iframe
    if (window.parent && window.parent !== window) {
      console.log('SCORM: Detected iframe environment, auto-initializing...');
      API.LMSInitialize('');
    }
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  }

  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return API;
    });
  }

})();
