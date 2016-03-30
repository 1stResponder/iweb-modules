/*
 * Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
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
define(["./AbstractPanel", './ShapeController'],
	function(AbstractPanel, ShapeController) {
	return Ext.define('modules.sample-app.ShapePanel', {
		extend: 'modules.sample-app.AbstractPanel',
		
		controller: 'sampleapp.shapecontroller',
		title: "Draw a Shape",
		tooltip: 'Select a region on the map',

		items:[
		{
            xtype: 'form',
            reference: "shapeRequestForm",
            title: 'Shape Request Form: Draw a Shape on the map',
            width: 300,
            bodyPadding: 10,
            border:false,
            defaultType: 'textarea',
            items: [
					   {
                        fieldLabel: 'Shape Geography',
                        name: 'shapeGeography',
                        xtype:'textarea',
                        grow:true,
                        regex: /type:polygon,coordinates:/i,
                        invalidText: 'Please enter valid coordinates.'
                   }

]}
		],
		buttons: [{
			text: 'Draw Shape',
			reference: 'DrawButton',
			handler: 'onDrawClick',
			toggleHandler: 'onLocateToggle',
			enableToggle: true
		},{  
			text: "Reset Tool",
			reference: "reset",
			handler: "onResetClick"
		},{
			text: "Clear",
			reference: "clear",
			handler: "onClearClick"
		}
		],
		getShapeGeometryInput: function() {
			return this.getView().lookupReference('shapeGeometry');
		}
		
	});
});