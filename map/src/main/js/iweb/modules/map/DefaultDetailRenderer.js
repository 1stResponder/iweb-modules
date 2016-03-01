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
define(['ext', 'ol', 'iweb/CoreModule'], function(Ext, ol, Core){
	
	return Ext.define('map.DescriptionDetailRenderer', {
		
		constructor: function() {
		},
		
		render: function(container, feature) {
		
			if(feature.get('type') == 'incident'){
			
				container.add( new Ext.form.field.Display({
					fieldLabel: 'Incident Name',
					value: feature.get('incidentname')
				}));
				
				var desc = feature.get('description');
				
				if(desc) {
					container.add( new Ext.form.field.Display({
						fieldLabel: 'Description',
						value: desc
					}));
				}
				
			}
			else{
				
				var type = feature.get('type');		
				if(type) {
					container.add( new Ext.form.field.Display({
						fieldLabel: 'Type',
						value: type
					}));
				}
				
				var sym = feature.get('sym');		
				if(sym) {
					container.add( new Ext.form.field.Display({
						fieldLabel: 'Waypoint Symbol',
						value: sym
					}));
				}
				
				var desc = feature.get('description');
				if (desc) {
					var desc = new Ext.form.field.Display({
						fieldLabel: 'Description',
						labelAlign: 'top',
						value: desc
					});
					container.add( desc );
					
					//make all (non-mailto) links open in a new window
					desc.getEl().select("a:not([href^='mailto'])").set({"target" : "_blank"});
				}
			}	
			return true;
		}
		
	});

});
