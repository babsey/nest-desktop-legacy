import numpy as np

def lcrn_gauss_targets(s_id,srow,scol,trow,tcol,ncon,con_std):
    grid_scale = float(trow)/float(srow)
    s_x = np.remainder(s_id,scol) # column id
    s_y = int(s_id)/int(scol)# row id
    s_x1 = s_x * grid_scale # column id in the new grid
    s_y1 = s_y * grid_scale # row_id in the new grid

    # pick up ncol values for phi and radius
    phi = np.random.uniform(low=-np.pi, high=np.pi, size=ncon)
    radius = con_std * np.random.randn(ncon)
    t_x = np.remainder(radius*np.cos(phi) + s_x1,tcol)
    t_y = np.remainder(radius*np.sin(phi) + s_y1,trow)
    target_ids = np.remainder(np.round(t_y)*tcol + np.round(t_x), trow*tcol)
    target = np.array(target_ids).astype('int')
    delays = np.abs(radius)/tcol
    return target, delays

def lcrn_gauss_targets_rift(s_id,srow,scol,trow,tcol,ncon,con_std,shift=1):
    grid_scale = float(trow)/float(srow)
    s_x = np.remainder(s_id,scol) # column id
    s_y = int(s_id)/int(scol)# row id
    s_x1 = s_x * grid_scale # column id in the new grid
    s_y1 = s_y * grid_scale # row_id in the new grid

    # pick up ncol values for phi and radius
    phi = np.random.uniform(low=-np.pi, high=np.pi, size=ncon)
    radius = con_std * np.random.randn(ncon)
    radius[radius>0] = radius[radius>0] + shift + .1
    radius[radius<0] = radius[radius<0] - shift - .1
    t_x = np.remainder(radius*np.cos(phi) + s_x1,tcol)
    t_y = np.remainder(radius*np.sin(phi) + s_y1,trow)
    target_ids = np.remainder(np.round(t_y)*tcol + np.round(t_x), trow*tcol)
    target = np.array(target_ids).astype('int')
    delays = np.abs(radius)/tcol
    return target, delays

def lcrn_gauss_targets_donut(s_id,srow,scol,trow,tcol,ncon,con_mean,con_std):
    grid_scale = float(trow)/float(srow)
    s_x = np.remainder(s_id,scol) # column id
    s_y = int(s_id)/int(scol)# row id
    s_x1 = s_x * grid_scale # column id in the new grid
    s_y1 = s_y * grid_scale # row_id in the new grid

    # pick up ncol values for phi and radius
    phi = np.random.uniform(low=-np.pi, high=np.pi, size=ncon)
    pradius = con_std * np.random.randn(ncon) + con_mean
    nradius = -(con_std * np.random.randn(ncon) + con_mean)
    radius = np.concatenate([np.floor(nradius[nradius<0][:ncon/2]), np.ceil(pradius[pradius>0][:ncon/2])])
    t_x = np.remainder(radius*np.cos(phi) + s_x1,tcol)
    t_y = np.remainder(radius*np.sin(phi) + s_y1,trow)
    target_ids = np.remainder(np.round(t_y)*tcol + np.round(t_x), trow*tcol)
    target = np.array(target_ids).astype('int')
    delays = np.abs(radius)/tcol
    return target, delays

def lcrn_gamma_targets(s_id,srow,scol,trow,tcol,ncon,k=2,theta=1,shift=1):
    grid_scale = float(trow)/float(srow)
    s_x = np.remainder(s_id,scol) # column id
    s_y = int(s_id)/int(scol)# row id
    s_x1 = s_x * grid_scale # column id in the new grid
    s_y1 = s_y * grid_scale # row_id in the new grid

    # pick up ncol values for phi and radius
    phi = np.random.uniform(low=-np.pi, high=np.pi, size=ncon)
    radius = np.concatenate((-np.random.gamma(k,theta,ncon/2), np.random.gamma(k,theta,ncon/2)))
    radius[radius>0] = radius[radius>0] + shift + .1
    radius[radius<0] = radius[radius<0] - shift - .1
    t_x = np.remainder(radius*np.cos(phi) + s_x1,tcol)
    t_y = np.remainder(radius*np.sin(phi) + s_y1,trow)
    target_ids = np.remainder(np.round(t_y)*tcol + np.round(t_x), trow*tcol)
    target = np.array(target_ids).astype('int')
    delays = np.abs(radius)/tcol
    return target, delays

def lcrn_exp_targets(s_id,srow,scol,trow,tcol,ncon,con_std, min_radius, max_radius):
    grid_scale = float(trow)/float(srow)
    s_x = np.remainder(s_id,scol) # column id
    s_y = int(s_id)/int(scol)# row id
    s_x1 = s_x * grid_scale # column id in the new grid
    s_y1 = s_y * grid_scale # row_id in the new grid

    # pick up ncol values for phi and radius
    phi = np.random.uniform(low=-np.pi, high=np.pi, size=ncon)
    max_dist = max_radius - min_radius
    radius_1 = np.random.exponential(con_std,ncon*10)
    tmp_id = pyl.find(radius_1<max_dist) 
    radius = radius_1[tmp_id[0:ncon]]+ min_radius
    radius[1:int(ncon/2)] = radius[1:int(ncon/2)]*-1
    delays = np.abs(radius)/tcol
    t_x = np.remainder(radius*np.cos(phi) + s_x1,tcol)
    t_y = np.remainder(radius*np.sin(phi) + s_y1,trow)
    target_ids = np.floor(t_y)*tcol + np.floor(t_x)
    target = np.array(target_ids).astype('int')
    return target, delays

def lcrn_uniform_targets(s_id,srow,scol,trow,tcol,ncon, min_radius, max_radius):
    grid_scale = float(trow)/float(srow)
    s_x = np.remainder(s_id,scol) # column id
    s_y = int(s_id)/int(scol)# row id
    s_x1 = s_x * grid_scale # column id in the new grid
    s_y1 = s_y * grid_scale # row_id in the new grid

    # pick up ncol values for phi and radius
    phi = np.random.uniform(low=-np.pi, high=np.pi, size=ncon)
    max_dist = max_radius - min_radius
    radius = np.random.uniform(low=min_radius, high=max_radius, size=ncon)
    delays = np.abs(radius)/tcol
    t_x = np.remainder(radius*np.cos(phi) + s_x1,tcol)
    t_y = np.remainder(radius*np.sin(phi) + s_y1,trow)
    target_ids = np.floor(t_y)*tcol + np.floor(t_x)
    target = np.array(target_ids).astype('int')
    return target, delays

