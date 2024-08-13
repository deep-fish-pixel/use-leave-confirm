import type { AxiosInterceptors, } from '@/api/helper/http.define';
import useNProgressInterceptor from './nProgress';
import useResponseMessageInterceptor from './responseMessage';

export default function setupInterceptors(interceptors: AxiosInterceptors) {
  useNProgressInterceptor(interceptors);
  useResponseMessageInterceptor(interceptors);
}
