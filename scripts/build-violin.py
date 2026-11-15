"""Original full-size violin. Run with Blender --background --python this_file.
Dimensions informed by https://www.ruschil.com/violin-measurements.
Model coordinates are millimetres: X across, Y toward scroll, Z toward player.
"""
import bpy, bmesh, math, os, json
import numpy as np
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'public', 'models')
SOURCE = os.path.join(ROOT, 'art', 'violin')
PREVIEW = os.path.join(ROOT, 'output', 'blender')
for path in (ASSETS, SOURCE, PREVIEW): os.makedirs(path, exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
instrument = []

def material(name, rgb, rough=.3, metallic=0):
    mat = bpy.data.materials.new(name); mat.diffuse_color = (*rgb, 1); mat.use_nodes = True
    node = mat.node_tree.nodes.get('Principled BSDF')
    node.inputs['Base Color'].default_value = (*rgb, 1)
    node.inputs['Roughness'].default_value = rough
    node.inputs['Metallic'].default_value = metallic
    return mat

def timber(name, maple=False):
    mat = material(name, (.55,.25,.07), .28)
    w, h = 1024, 2048
    y, x = np.mgrid[0:h,0:w].astype(np.float32)
    bend = x + 2*np.sin(y*.006) + .7*np.sin(y*.019)
    grain = ((np.sin(bend*1.3 + np.sin(bend*.079)*1.7)+1)/2)**14
    fine = np.sin(x*2.9 + y*.012)*.018
    flame = np.sin(y*.075 + np.sin(x*.012)*1.8) * (.085 if maple else .012)
    shade = 1 - grain*.16 + fine + flame
    # Subtle, nonuniform amber varnish. The longitudinal grain is modeled in UV space.
    warm = .035*np.sin(x*.018 + y*.002)
    pixels = np.ones((h,w,4), dtype=np.float32)
    for channel, base in enumerate((.62,.305,.098) if not maple else (.54,.235,.065)):
        pixels[:,:,channel] = np.clip(base*shade + warm*(1 if channel==0 else .45),0,1)
    image = bpy.data.images.new(name+' • varnished grain',width=w,height=h)
    image.pixels.foreach_set(pixels.ravel()); image.file_format='PNG'
    image.filepath_raw = os.path.join(SOURCE, 'maple.png' if maple else 'spruce.png'); image.save(); image.pack()
    nodes = mat.node_tree.nodes; links = mat.node_tree.links
    tex = nodes.new('ShaderNodeTexImage'); tex.image=image
    links.new(tex.outputs['Color'],nodes.get('Principled BSDF').inputs['Base Color'])
    bsdf = nodes.get('Principled BSDF'); bsdf.inputs['Coat Weight'].default_value=.32
    bsdf.inputs['Coat Roughness'].default_value=.22
    return mat

spruce=timber('Varnished fine-grain spruce')
maple=timber('Flamed maple',True)
ebony=material('Polished ebony',(.016,.012,.009),.25)
bridge_mat=material('Unvarnished maple bridge',(.69,.48,.25),.49)
ivory=material('Purfling light wood',(.64,.48,.27),.45)
steel=material('Wound silver strings',(.55,.58,.6),.23,.85)
gold=material('Brass fittings',(.55,.34,.11),.25,.8)
hair=material('Natural bow hair',(.8,.74,.59),.6)
bowwood=material('Pernambuco bow',(.13,.036,.012),.24)

def finish(obj, mat, smooth=True):
    obj.data.materials.append(mat)
    if obj.type=='MESH' and smooth:
        for polygon in obj.data.polygons: polygon.use_smooth=True
    instrument.append(obj); return obj

def mesh(name, verts, faces, mat, uv=True):
    data=bpy.data.meshes.new(name); data.from_pydata(verts,[],faces); data.update()
    obj=bpy.data.objects.new(name,data); bpy.context.collection.objects.link(obj)
    bm=bmesh.new(); bm.from_mesh(data); bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces)); bm.to_mesh(data); bm.free()
    if uv:
        layer=data.uv_layers.new(name='Timber grain')
        for polygon in data.polygons:
            for li in polygon.loop_indices:
                p=data.vertices[data.loops[li].vertex_index].co
                layer.data[li].uv=(p.x/220+.5,p.y/355+.5)
    return finish(obj,mat)

def curve(name, points, radius, mat, cyclic=False):
    data=bpy.data.curves.new(name,'CURVE'); data.dimensions='3D'; data.resolution_u=1
    spline=data.splines.new('POLY'); spline.points.add(len(points)-1)
    for p,co in zip(spline.points,points): p.co=(*co,1)
    spline.use_cyclic_u=cyclic; data.bevel_depth=radius; data.bevel_resolution=3
    obj=bpy.data.objects.new(name,data); bpy.context.collection.objects.link(obj)
    return finish(obj,mat)

def sphere(name, location, scale, mat, segments=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=12,location=location)
    obj=bpy.context.object; obj.name=name; obj.scale=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(obj,mat)

def cylinder_between(name,a,b,radius,mat,vertices=16,r2=None):
    delta=Vector(b)-Vector(a)
    bpy.ops.mesh.primitive_cone_add(vertices=vertices,radius1=radius,radius2=radius if r2 is None else r2,depth=delta.length,location=(Vector(a)+Vector(b))/2)
    obj=bpy.context.object; obj.name=name; obj.rotation_euler=delta.to_track_quat('Z','Y').to_euler()
    return finish(obj,mat)

def bezier(a,b,c,d,n=24):
    return [tuple((1-t)**3*a[k]+3*(1-t)**2*t*b[k]+3*(1-t)*t*t*c[k]+t**3*d[k] for k in range(len(a))) for t in np.linspace(0,1,n,endpoint=False)]

segments=[
 ((0,177.5),(40,178),(78,162),(83,130)),
 ((83,130),(89,105),(72,83),(70,71)),
 ((70,71),(69,64),(75,59),(79,58)),
 ((79,58),(68,55),(54,40),(56,15)),
 ((56,15),(55,-8),(65,-31),(84,-41)),
 ((84,-41),(78,-44),(81,-56),(91,-69)),
 ((91,-69),(113,-96),(104,-135),(80,-155)),
 ((80,-155),(57,-175),(23,-177.5),(0,-177.5)),
]
half=[]
for segment in segments: half+=bezier(*segment,n=22)
half.append((0,-177.5))
outline=half+[(-x,y) for x,y in half[-2:0:-1]]
N=len(outline)
outline_array=np.asarray(outline)
def plate_height(x,y,front=True):
    distance=float(np.min(np.linalg.norm(outline_array-np.asarray((x,y)),axis=1)))
    arch=(17 if front else 16)*(1-math.exp(-distance/14))*math.exp(-.55*((x/140)**2+(y/220)**2))
    return 15.5+arch if front else -15.5-arch

def plate(name,mat,front=True):
    vertices=[(0,0,32.5 if front else -31.5)]; faces=[]; rings=25
    for row in range(1,rings+1):
        r=row/rings
        for x,y in outline:
            z=plate_height(x*r,y*r,front)
            vertices.append((x*r,y*r,z))
    for i in range(N): faces.append((0,1+i,1+(i+1)%N))
    for row in range(rings-1):
        a=1+row*N; b=a+N
        for i in range(N): j=(i+1)%N; faces.append((a+i,b+i,b+j,a+j))
    if front: faces=[tuple(reversed(f)) for f in faces]
    obj=mesh(name,vertices,faces,mat)
    bpy.context.view_layer.objects.active=obj; obj.select_set(True)
    solid=obj.modifiers.new('Carved plate thickness','SOLIDIFY'); solid.thickness=2.8; solid.offset=-1
    bpy.ops.object.modifier_apply(modifier=solid.name)
    bm=bmesh.new(); bm.from_mesh(obj.data); bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces)); bm.to_mesh(obj.data); bm.free()
    triangulate=obj.modifiers.new('Stable curved-surface topology','TRIANGULATE'); bpy.ops.object.modifier_apply(modifier=triangulate.name)
    obj.select_set(False); return obj

top=plate('Carved spruce soundboard',spruce)
back=plate('Arched two-piece maple back',maple,False)
verts=[]
for z in (-15.5,15.5): verts += [(x*.975,y*.985,z) for x,y in outline]
ribs=mesh('Flamed maple ribs',verts,[(i,(i+1)%N,(i+1)%N+N,i+N) for i in range(N)],maple)
solid=ribs.modifiers.new('Rib thickness','SOLIDIFY'); solid.thickness=1.1
# Delicate overhang and traditional three-strand inlaid purfling.
for front in (True,False):
    z=16.4 if front else -16.4
    for factor,radius,mat in ((.968,.37,ebony),(.961,.31,ivory),(.954,.33,ebony)):
        curve(('Front' if front else 'Back')+' purfling',[(x*factor,y*factor,plate_height(x*factor,y*factor,front)+(.25 if front else -.25)) for x,y in outline],radius,mat,True)
    curve('Rounded plate edge',[(x,y,15.3 if front else -15.3) for x,y in outline],1.15,maple,True)

def cutter_from_polygon(name,polygon):
    vertices=[(x,y,z) for z in (5,55) for x,y in polygon]; n=len(polygon)
    faces=[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
    data=bpy.data.meshes.new(name); data.from_pydata(vertices,[],faces); data.update()
    obj=bpy.data.objects.new(name,data); bpy.context.collection.objects.link(obj); return obj

def cut(obj,cutter):
    bm=bmesh.new(); bm.from_mesh(cutter.data); bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces)); bm.to_mesh(cutter.data); bm.free()
    bpy.context.view_layer.objects.active=obj
    modifier=obj.modifiers.new('Actual carved sound opening','BOOLEAN'); modifier.operation='DIFFERENCE'; modifier.solver='MANIFOLD'; modifier.object=cutter
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    print('CUT_RESULT',obj.name,len(obj.data.vertices),len(obj.data.polygons),flush=True)
    bpy.data.objects.remove(cutter,do_unlink=True)

for sign in (-1,1):
    path=bezier((39,48),(53,40),(32,15),(37,-4),24)+bezier((37,-4),(43,-20),(26,-25),(32,-37),24)+[(32,-37)]
    left=[]; right=[]
    for i,(x,y) in enumerate(path):
        p=Vector(path[max(0,i-1)]); q=Vector(path[min(len(path)-1,i+1)]); t=(q-p).normalized(); normal=Vector((-t.y,t.x))
        width=1.15+1.05*math.sin(i/(len(path)-1)*math.pi)**2
        left.append((sign*(x+normal.x*width),y+normal.y*width))
        right.append((sign*(x-normal.x*width),y-normal.y*width))
    cut(top,cutter_from_polygon('f-hole cutter',left+list(reversed(right))))
    for x,y in (path[0],path[-1]):
        bpy.ops.mesh.primitive_cylinder_add(vertices=32,radius=3.15,depth=60,location=(sign*x,y,25))
        cut(top,bpy.context.object)
    # Small inward-facing maker's notch at the bridge line.
    cut(top,cutter_from_polygon('f-hole notch',[(sign*34,-10),(sign*42,-8),(sign*35,-6)]))

# Neck: 130 mm from top edge to nut, rounded maple underside.
neck=sphere('Maple neck heel',(0,165,6),(18,27,18),maple)
cylinder_between('Carved maple neck',(0,176,12),(0,307.5,26),12,maple,32,r2=9)
# Tapered, cambered 270 mm ebony fingerboard (nut to overhanging end).
rows,cols=30,20; vertices=[]; faces=[]
for row in range(rows+1):
    t=row/rows; y=307.5-t*270; width=11.75+t*9.25
    for col in range(cols+1):
        x=(col/cols*2-1)*width
        z=38+t*14+math.sqrt(max(0,41.5**2-x*x))-41.5
        vertices.append((x,y,z))
for row in range(rows):
    for col in range(cols):
        a=row*(cols+1)+col; faces.append((a,a+1,a+cols+2,a+cols+1))
board=mesh('Cambered tapered ebony fingerboard',vertices,faces,ebony)
solid=board.modifiers.new('Fingerboard edge thickness','SOLIDIFY'); solid.thickness=5.5
bevel=board.modifiers.new('Soft dressed edges','BEVEL'); bevel.width=.5; bevel.segments=2
curve('Ebony nut',[(-11.75,308.5,36),(0,308.5,37),(11.75,308.5,36)],1.6,ebony)

# Hollow pegbox with maple cheeks and black inner cavity.
for sign in (-1,1):
    points=[(sign*10,309,27),(sign*11,334,23),(sign*10,365,19)]
    curve('Pegbox maple cheek',points,3.2,maple)
curve('Pegbox dark interior',[(0,316,26),(0,357,22)],6,ebony)
for i in range(4):
    y=318+i*11; z=26-i*1.3; sign=1 if i%2 else -1
    cylinder_between('Ebony tuning peg shaft',(-14,y,z),(14,y,z),2.1,ebony)
    cylinder_between('Peg collar',(sign*12,y,z),(sign*18,y,z),3,ebony)
    sphere('Carved ebony peg head',(sign*22,y,z),(5.3,8.2,3),ebony)
    sphere('Peg brass pin',(sign*25,y,z),(1,1.3,1.3),gold,16)
# Volute curls in side profile around the X axis, with carved twin scroll faces.
scroll=[]
for t in np.linspace(0,1,130):
    a=-math.pi*.7+t*math.pi*3.5; r=12*(1-t)+2.2
    scroll.append((0,375+math.sin(a)*r,22+math.cos(a)*r))
curve('Carved maple scroll volute',scroll,5.7,maple)
for sign in (-1,1):
    curve('Scroll carved spiral ridge',[(sign*5.6,y,z) for _,y,z in scroll],.6,bowwood)

# Cut maple bridge: two feet, heart, kidneys, and a curved crown.
bridge_outline=[(-21,0),(-21,4),(-14,6),(-13,13),(-17,22),(-16,29),(-9,33),(0,35),(9,33),(16,29),(17,22),(13,13),(14,6),(21,4),(21,0),(10,0),(9,7),(0,10),(-9,7),(-10,0)]
vertices=[(x,-17+dy,29+z) for dy in (-2.2,2.2) for x,z in bridge_outline]; n=len(bridge_outline)
bridge=mesh('Carved maple bridge',vertices,[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)],bridge_mat)
# Kidney and heart apertures run through the thin bridge along Y.
for x,z,rx,rz in ((-8,50,4,3.4),(8,50,4,3.4),(0,55,3,3.7)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=24,radius=1,depth=12,location=(x,-17,z),rotation=(math.pi/2,0,0))
    cutter=bpy.context.object; cutter.scale=(rx,rz,1); bpy.context.view_layer.objects.active=cutter; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    cut(bridge,cutter)

# Ebony tailpiece, saddle, tailgut and discrete tuning hardware.
tail_outline=[(-7,-164),(7,-164),(15,-88),(11,-76),(-11,-76),(-15,-88)]
vertices=[(x,y,z) for z in (31,37) for x,y in tail_outline]; n=len(tail_outline)
tail=mesh('Ebony tailpiece',vertices,[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)],ebony)
bevel=tail.modifiers.new('Tailpiece rounded carving','BEVEL'); bevel.width=2; bevel.segments=3
curve('Saddle',[(-17,-174,18),(17,-174,18)],2,ebony)
for sign in (-1,1): curve('Tailgut',[(sign*5,-158,33),(sign*6,-176,17),(sign*5,-182,0)],.7,ebony)
cylinder_between('Ebony end button',(0,-175,0),(0,-187,0),4.4,ebony)
sphere('Ebony chinrest',(-54,-127,32),(36,33,5),ebony,40)
for x in (-69,-40):
    curve('Chinrest clamp',[(x,-151,30),(x,-174,13),(x,-170,-18)],1.05,steel)
    cylinder_between('Chinrest clamp barrel',(x,-170,-15),(x,-170,-2),2.2,steel)

# Four real strings follow separate peg–nut–bridge–tailpiece paths.
for i,radius in enumerate((.42,.33,.25,.14)):
    nut_x=-8.25+i*5.5; bridge_x=-16.5+i*11
    bridge_z=64-((bridge_x/16.5)**2)*3
    path=[(nut_x*.6,320+i*11,29-i*.9),(nut_x,308.5,38),(bridge_x,-17,bridge_z),(bridge_x*.65,-82,39)]
    curve(('G','D','A','E')[i]+' string',path,radius,steel)
    sphere('String ball end',(bridge_x*.65,-83,39),(1.2,1.2,1),gold,12)
    cylinder_between('Fine tuner screw',(bridge_x*.65,-90,36),(bridge_x*.65,-90,42),.75,steel)

# Bow scaled in relation to the violin: approximately 740 mm long.
bow_group=bpy.data.objects.new('Bow assembly',None); bpy.context.collection.objects.link(bow_group); instrument.append(bow_group)
before=len(instrument)
points=[(137+3*math.sin(t*math.pi),-285+t*700,24+8*math.sin(t*math.pi)) for t in np.linspace(0,1,90)]
curve('Pernambuco bow stick',points,2.2,bowwood)
for offset in np.linspace(-2,2,9): curve('Individual bow hair ribbon',[(130+offset,-258,15),(130+offset,407,15)],.16,hair)
sphere('Ebony bow frog',(134,-252,20),(5,19,7),ebony)
curve('Silver frog ferrule',[(129,-233,14),(139,-233,14),(139,-233,23),(129,-233,23)],.7,steel,True)
cylinder_between('Bow screw button',(137,-286,24),(137,-298,24),3.3,ebony)
curve('Bow tip',[(137,415,24),(131,422,15),(130,407,15)],2.2,bridge_mat)
for i in range(18):
    a=i*.95; y=-217+i*.8
    curve('Silver grip winding',[(137+2.4*math.cos(t),y,27+2.4*math.sin(t)) for t in np.linspace(0,math.tau,12)],.35,steel,True)
for obj in instrument[before:]: obj.parent=bow_group
# Bow remains a separate named group for web animation.

# Export only the instrument; front faces +Z in glTF and neck points +Y.
root=bpy.data.objects.new('Saurav • studio violin',None); bpy.context.collection.objects.link(root)
for obj in instrument:
    if obj.parent is None: obj.parent=root
bpy.ops.object.select_all(action='DESELECT')
root.rotation_euler.x=math.pi/2
for obj in instrument+[root]: obj.select_set(True)
bpy.context.view_layer.objects.active=root
bpy.ops.export_scene.gltf(filepath=os.path.join(ASSETS,'violin.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_materials='EXPORT',export_image_format='AUTO')
root.rotation_euler.x=0

# A small studio scene for repeatable model review.
world=bpy.data.worlds.new('Mineral paper studio'); bpy.context.scene.world=world; world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(.24,.27,.20,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.35
def area(name,location,power,size,color):
    data=bpy.data.lights.new(name,'AREA'); data.energy=power; data.shape='DISK'; data.size=size; data.color=color
    obj=bpy.data.objects.new(name,data); bpy.context.collection.objects.link(obj); obj.location=location
    obj.rotation_euler=(Vector((0,80,0))-obj.location).to_track_quat('-Z','Y').to_euler()
area('Large softbox',(-300,300,650),2000000,450,(1,.86,.68))
area('Cool fill',(420,220,420),1400000,350,(.78,.87,1))
area('Rim',(50,-400,150),1100000,270,(1,.94,.8))
camera_data=bpy.data.cameras.new('Review camera'); camera=bpy.data.objects.new('Review camera',camera_data); bpy.context.collection.objects.link(camera)
camera.location=(240,-170,1000); target=Vector((35,65,0)); camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
camera_data.type='ORTHO'; camera_data.ortho_scale=870; camera_data.clip_end=10000; bpy.context.scene.camera=camera
scene=bpy.context.scene; scene.render.engine='CYCLES'; scene.cycles.samples=32
scene.render.resolution_x=1100; scene.render.resolution_y=1400; scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'; scene.render.film_transparent=True
scene.view_settings.view_transform='AgX'
scene.render.filepath=os.path.join(PREVIEW,'violin-studio.png')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(SOURCE,'violin.blend'))
bpy.ops.render.render(write_still=True)
# Orthographic front for proportion review.
camera.location=(0,70,1100); camera.rotation_euler=(Vector((0,70,0))-camera.location).to_track_quat('-Z','Y').to_euler()
scene.render.filepath=os.path.join(PREVIEW,'violin-front.png'); bpy.ops.render.render(write_still=True)
report={'body_length_mm':355,'upper_bout_mm':168,'lower_bout_mm':206,'neck_length_mm':130,'fingerboard_length_mm':270,'source':'Original Blender geometry and generated embedded wood-grain textures','glb_bytes':os.path.getsize(os.path.join(ASSETS,'violin.glb')),'objects':len(instrument)}
with open(os.path.join(SOURCE,'model-report.json'),'w') as file: json.dump(report,file,indent=2)
print('VIOLIN_COMPLETE',json.dumps(report))
