/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {HttpResponse} from "@angular/common/http";

export interface CacheEntry {
  url: string;
  response: HttpResponse<any>
  entryTime: number;
}

export let MAX_CACHE_AGE = 60000;
