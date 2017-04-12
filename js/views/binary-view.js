const BinaryView = (function(){

	const defaults = {
		root : null //required
	};

    function create(options){
        let binaryView = {};
		binaryView.options = Object.assign({}, defaults, options)
        bind(binaryView);
        binaryView.init();
        return binaryView;
    }
    function bind(binaryView){
        binaryView.init = init.bind(binaryView);
		binaryView.cacheDom = cacheDom.bind(binaryView);
		binaryView.setBndr = setBndr.bind(binaryView);
		binaryView.drop = drop.bind(binaryView);
		binaryView.load = load.bind(binaryView);
		binaryView.render = render.bind(binaryView);
    }
	function cacheDom(){
		this.dom = {};
		this.dom.root = this.options.root;
	}
	function setBndr(){
		let bndrAndModel = Bndr.create()
			.setTemplate(this.dom.root)
			.setModel({
				dragover : false,
				mode : "hex",
				modeText : "Hex",
				binaryReader : null
			})
			.bindDrag(".dropzone", "dragover")
			.bindClass(".dropzone", "dragover", "dragover")
			.bindEvent(".dropzone", "drop", this.drop)
			.bindToggle(".mode", "click", "mode", ["hex", "bin", "dec", "ascii"])
			.bindElement(".mode", "modeText")
			.bindChange("mode", this.render)
			.computeValue("mode", x => x[0].toUpperCase() + x.substr(1), "modeText")
			.attach()
			.getBndrAndModel();
		this.bndr = bndrAndModel.bndr;
		this.model = bndrAndModel.model;
	}
	function drop(e){
		this.model.dragover = false;
		e.preventDefault();
		let file = e.dataTransfer.files[0];
		let reader = new FileReader();
		reader.onerror = x => console.error(x);
		reader.onload = this.load;
		reader.readAsArrayBuffer(file);
	}
	function load(e){
		let fileBytes = e.target.result;
		this.model.binaryReader = BinaryReader.create(fileBytes);
		this.render();
	}
	function render(){
		let dropzone = this.dom.root.querySelector(".dropzone");
		let docfrag = document.createDocumentFragment();
		if(!this.model.binaryReader){
			return;
		}
		this.model.binaryReader.index = 0;
		dropzone.innerHTML = "";
		while(this.model.binaryReader.canReadMore()){
			let value = this.model.binaryReader.readUint8();
			let valueElement = document.createElement("span");
			if(this.model.mode === "hex"){
				valueElement.innerText = Util.numberAsHex(value);
			}else if(this.model.mode === "bin"){
				valueElement.innerText = Util.numberAsBin(value);
			}else if(this.model.mode === "ascii"){
				valueElement.innerText = Util.numberAsAscii(value);
			}else{
				valueElement.innerText = value;
			}
			docfrag.appendChild(valueElement);
		}
		dropzone.appendChild(docfrag);
	}
    function init(){
		this.cacheDom();
		this.setBndr();
    }
    return {
        create : create
    };
})();
