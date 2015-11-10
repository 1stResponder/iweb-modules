/*
 * Copyright (c) 2008-2015, Massachusetts Institute of Technology (MIT)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define([], function() {
    "use strict";

    return {

        /**
         * Function: getUTCTimestamp
         * Gets the date/timestamp for the current UTC time.
         *
         * Returns:
         *        timestamp - a string representing the date/time
         *                    in the format "YYYY-MM-DD HH:MM:SS" (GMT/UTC)
         */
        getUTCTimestamp: function() {
            var date = new Date();
            return date.getUTCFullYear() + "-" + this.pad(date.getUTCMonth() + 1) +
            "-" + this.pad(date.getUTCDate()) + " " + this.pad(date.getUTCHours()) +
            ":" + this.pad(date.getUTCMinutes()) + ":" + this.pad(date.getUTCSeconds());
        },

        /**
         * Function: pad
         * Pads a string with an extra zero on the left if the string is of
         * length 1.
         *
         * Parameters:
         *        inStr - the string to pad
         */
        pad: function(inStr) {
            var str = inStr + ""; // coerce to string
            if (str.length === 1) {
                return "0".concat(str);
            }
            return str;
        },

        /**
         * Function: generateUUID
         * Generates a UUID as per RFC 4122 ver4.
         * Code from this post: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
         */
        generateUUID: function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c === "x" ? r : r & 0x3 | 0x8;
                return v.toString(16);
            }).toUpperCase();
        },

        validateInterface: function(iface, obj) {
            for (var prop in iface) {
                if (obj[prop]) {
                    return false;
                }
            }
            return true;
        },
        
        /**
         * Date from db was considered an invalid date, so split it up and create a new date
         * @param date
         * @returns {Date}
         */
        splitDate: function(date)
        {
            var year,
                month,
                day,
                hour,
                min,
                sec;
            try
            {
                date = date.split("-");
                year = date[0];
                month = date[1] - 1;
                date = date[2].split(" ");
                day = date[0];
                date = date[1].split(":");
                hour = date[0];
                min = date[1];
                date = date[2].split(".");
                sec = date[0];

                return new Date(year, month, day, hour, min, sec);
            } catch (e)
            { // was just created if there's a problem with the date..
                return new Date();
            }
        }, // split date
        
        /**
         * take created date and format to Y-m-d H:i:s
         * @param created
         */
        formatDateToString: function(date)
        {
            var str = date.getFullYear() + "-"
            + this.pad(date.getMonth() + 1) + "-"
            + this.pad(date.getDate()) + " "
            + this.pad(date.getHours() + ":" + this.pad(date.getMinutes())
            + ":" + this.pad(date.getSeconds()));

            return str;
        } // formatDateToString
        
    };

});
