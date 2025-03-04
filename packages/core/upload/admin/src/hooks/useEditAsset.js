import { useRef, useState } from 'react';

import { useFetchClient, useNotification } from '@strapi/helper-plugin';
import axios from 'axios';
import { useIntl } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';

import pluginId from '../pluginId';
import { getTrad } from '../utils';

const editAssetRequest = (asset, file, cancelToken, onProgress, post) => {
  const endpoint = `/${pluginId}?id=${asset.id}`;

  const formData = new FormData();

  if (file) {
    formData.append('files', file);
  }

  formData.append(
    'fileInfo',
    JSON.stringify({
      alternativeText: asset.alternativeText,
      focalPoint: asset.focalPoint,
      caption: asset.caption,
      folder: asset.folder,
      name: asset.name,
    })
  );

  return post(endpoint, formData, {
    cancelToken: cancelToken.token,
    onUploadProgress({ total, loaded }) {
      onProgress((loaded / total) * 100);
    },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((res) => res.data);
};

export const useEditAsset = () => {
  const [progress, setProgress] = useState(0);
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const queryClient = useQueryClient();
  const tokenRef = useRef(axios.CancelToken.source());
  const { post } = useFetchClient();

  const mutation = useMutation(
    ({ asset, file }) => editAssetRequest(asset, file, tokenRef.current, setProgress, post),
    {
      onSuccess() {
        queryClient.refetchQueries([pluginId, 'assets'], { active: true });
        queryClient.refetchQueries([pluginId, 'asset-count'], { active: true });
        queryClient.refetchQueries([pluginId, 'folders'], { active: true });
      },
      onError(reason) {
        if (reason.response.status === 403) {
          toggleNotification({
            type: 'info',
            message: { id: getTrad('permissions.not-allowed.update') },
          });
        } else {
          toggleNotification({ type: 'warning', message: reason.message });
        }
      },
    }
  );

  const editAsset = (asset, file) => mutation.mutateAsync({ asset, file });

  const cancel = () =>
    tokenRef.current.cancel(
      formatMessage({ id: getTrad('modal.upload.cancelled'), defaultMessage: '' })
    );

  return { ...mutation, cancel, editAsset, progress, status: mutation.status };
};
