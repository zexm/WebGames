eval( function(E, I, A, D, J, K, L, H) {
	function C(A) {
		return A < 62 ? String.fromCharCode(A += A < 26 ? 65 : A < 52 ? 71 : -4) : A < 63 ? '_' : A < 64 ? '$' : C(A >> 6) + C(A & 63)
	}

	while (A > 0)
	K[C(D--)] = I[--A];
	function N(A) {
		return K[A] == L[A] ? A : K[A]
	}

	if (''.replace(/^/, String)) {
		var M = E.match(J), B = M[0], F = E.split(J), G = 0;
		if (E.indexOf(F[0]))
			F = [''].concat(F);
		do {
			H[A++] = F[G++];
			H[A++] = N(B)
		} while(B=M[G]);
		H[A++] = F[G] || '';
		return H.join('')
	}
	return E.replace(J, N)
}('n 0(){Z A=6.roadChangeCurveCoefficientRandomTimeoutMin,C=6.roadChangeCurveCoefficientRandomTimeoutMax,M=C-A,J=6.maxCurveCoefficient,B=150,H=P.25,F=t.2("{4}.x.road"),BD=t.2("{4}.x.pathCacher"),L=t.2("{4}.x.background"),I=t.2("{4}.x.cover"),K=t.2("{4}.x.timer"),E=t.2("{4}.x.keymap"),T=t.2("{4}.x.car"),N=t.2("{4}.x.dashboard"),D=t.2("{4}.x.speed"),G=t.2("{4}.x.pause"),O=t.2("{4}.x.u"),S=t.2("{4}.x.main",{5:0(){L.5();T.5();F.5();I.5();N.5();D.5();G.5();K.5();loaderBar.done();I.showTree.defer(I,500);BC.8()},8:0(){Z T=t.getModuleContainer("u");T=o.z(T);Z B=i O.q({container:T,p:BB,w:BB,b:"v/u-q.c"});B.render();Z D=i O.dragGroup({limit:40,itemGlobalConf:{q:B}});D.7({p:V,w:V,j:U,e:U,$:Q/R,b:"v/u-k.d"});D.7({p:V,w:V,j:U,e:U,$:BE/R,b:"v/u-k.d"});D.7({p:V,w:V,j:U,e:U,$:BF/R,b:"v/u-k.d"});D.7({p:Y,w:Y,j:X,e:X,$:Q,b:"v/u-g.c",primary:l});E.8(D);Z A=o.z("u-option"),S=o._("input",A.a)[P];S=o.z(S);Z C=o._("label",A.a)[P];C=o.z(C);C.3({s:0(){S.a.y=!S.a.y;T.BA(S.a.y)}});S.3({s:0(){T.BA(S.a.y)}});o.loadImage(["v/u-g.c","v/u-k.d","v/u-q.c"])},1:0(){E.5();I.r();K.r();Z T;n 0(){W(T)T=P;m W(Math.random()>H)T=(o.9(J-B)+B)*(o.9(f)<h?Q:-Q);m T=o.9(B)*(o.9(f)<h?Q:-Q);Z S=o.9(M)+A;F.setTargetCurveCoefficient(T,0(){setTimeout(BC,T<H&&T!=P?P:S)}.bind(arguments.callee))}();6.started=l}});W(o.isIe)document.execCommand("BackgroundImageCache",false,l);S.5();S.1()}()', 'O|P|0|1|5|_|$|38|44|if|21|78|var|dom|pic|gif|png|top|200|bar|100|new|left|rods|true|else|void|Ucren|width|scene|start|click|System|paddle|images|height|modules|checked|Element|function|freeMode|nameSpace|addEvents|systemName|initialize|GlobalData|createItem|initPaddle|randomNumber|queryElement|moveMultiples|display|120|this|N|2|3'.split('|'), 57, 69, /[\w\$]+/g, {}, {}, []))