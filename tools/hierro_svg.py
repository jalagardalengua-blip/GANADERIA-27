"""Vectoriza un hierro de ganadería a partir de una imagen (hierro oscuro sobre fondo claro o de colores).
Uso: python3 -I tools/hierro_svg.py imagen.png "Nombre ganadería" [umbral]
Imprime una entrada para js/hierros.js con el trazado en una caja de 100x100."""
import sys,json
import numpy as np
from PIL import Image,ImageFilter
from skimage import measure
img=Image.open(sys.argv[1]).convert('RGB');name=sys.argv[2];th=float(sys.argv[3]) if len(sys.argv)>3 else .28
W=900;img=img.resize((W,int(img.height*W/img.width)),Image.LANCZOS)
a=np.asarray(img).astype(float)/255;mx=a.max(2);mn=a.min(2)
mask=(mx<th)&((mx-mn)<.25)                                # tinta oscura y poco saturada = el hierro
m=Image.fromarray((mask*255).astype('uint8')).filter(ImageFilter.GaussianBlur(2.2))
f=np.asarray(m).astype(float)/255
cs=[c for c in measure.find_contours(f,.5) if len(c)>40]
if not cs:sys.exit('sin trazos: prueba otro umbral')
pts=np.vstack(cs);y0,x0=pts.min(0);y1,x1=pts.max(0);s=86/max(x1-x0,y1-y0);ox=50-(x0+x1)/2*s;oy=50-(y0+y1)/2*s
d=[]
for c in cs:
    p=measure.approximate_polygon(c,tolerance=1.1)
    d.append('M'+' L'.join(f'{x*s+ox:.1f} {y*s+oy:.1f}' for y,x in p)+'Z')
print(json.dumps({name:''.join(d)},ensure_ascii=False))
