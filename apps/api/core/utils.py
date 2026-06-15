def prefetch_cross_db_fks(instances, fk_map, db='default'):
    for fk_field, model_cls in fk_map.items():
        ids = {
            getattr(obj, fk_field.attname)
            for obj in instances
            if getattr(obj, fk_field.attname) is not None
        }
        if not ids:
            continue
        related = model_cls.objects.using(db).filter(id__in=ids)
        cache = {obj.id: obj for obj in related}
        for obj in instances:
            fk_id = getattr(obj, fk_field.attname)
            if fk_id in cache:
                fk_field.set_cached_value(obj, cache[fk_id])
            elif fk_id is not None:
                fk_field.set_cached_value(obj, None)
