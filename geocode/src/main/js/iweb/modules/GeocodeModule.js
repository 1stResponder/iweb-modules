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
requirejs.config({
	paths: {
		'async': 'lib/require/async'
	}
});

define(["iweb/CoreModule", "iweb/modules/DrawMenuModule", "./geocode/Window",
        "./geocode/AppButton", "./geocode/AddressPanel",
        "./geocode/DecimalDegreesPanel", "./geocode/DegreesMinutesPanel",
        "./geocode/DegreesMinutesSecondsPanel", "./geocode/MGRSPanel"], 
	function(Core, DrawMenuModule, GeoWindow, AppButton,
			AddressPanel, DecimalDegreesPanel, DegreesMinutesPanel,
			DegreesMinutesSecondsPanel, MGRSPanel) {
		
		var GeocodeModule = function(){};
		
		GeocodeModule.prototype.load = function(){
			var window = new GeoWindow();
			var tabPanel = window.getTabPanel();
			
			tabPanel.add([
				new AddressPanel(),
				new DegreesMinutesSecondsPanel(),
				new DegreesMinutesPanel(),
				new DecimalDegreesPanel(),
				new MGRSPanel()
			]);
			tabPanel.setActiveTab(0);
			
			DrawMenuModule.addAppsButton(new AppButton({
				window: window
			}));
		};
		
		return new GeocodeModule();
	}
);
	
