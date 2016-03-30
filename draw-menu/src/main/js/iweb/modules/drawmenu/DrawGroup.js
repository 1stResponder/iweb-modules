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
define(["iweb/CoreModule", "./menuitems/MarkerButton", "./menuitems/LabelButton",
        "./menuitems/ShapeButton", "./menuitems/LineButton", "./menuitems/MeasureButton",
        "./menuitems/RotateButton", "./menuitems/FireLineButton", "./menuitems/ColorButton"],
        function(Core, MarkerButton, LabelButton, ShapeButton, LineButton,
          MeasureButton, RotateButton, FireLineButton, ColorButton) {
	
    return Ext.define(null, {
       extend: 'Ext.container.ButtonGroup',
       
       frame: false,
       columns: 3,
       
       defaults: {
          toggleGroup: "drawGroup",
          bubbleEvents: ["toggle"]
       },
       
       initComponent: function() {
    	   this.callParent();
    	   
    	   this.add( new MarkerButton(this.defaults) );
    	   this.add( new LabelButton(this.defaults) );
    	   this.add( new RotateButton(this.defaults) );
    	   this.add( new ShapeButton(this.defaults) );
    	   this.add( new LineButton(this.defaults) );
    	   this.add( new MeasureButton(this.defaults) );
    	   this.add( new FireLineButton(this.defaults) );
    	   this.add( new ColorButton(this.defaults) );
       }
       
    });

});
