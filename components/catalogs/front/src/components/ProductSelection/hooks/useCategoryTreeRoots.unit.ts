jest.unmock('./useCategoryTreeRoots');

import fetchMock from 'jest-fetch-mock';
import {renderHook} from '@testing-library/react-hooks';
import {useCategoryTreeRoots} from './useCategoryTreeRoots';
import {ReactQueryWrapper} from '../../../../tests/ReactQueryWrapper';

test('It fetches the API response', async () => {
    const treeRoots = [
        {
            id: 1,
            code: 'catA',
            label: '[catA]',
            isLeaf: false,
        },
        {
            id: 43,
            code: 'catB',
            label: '[catB]',
            isLeaf: false,
        },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(treeRoots));

    const {result, waitForNextUpdate} = renderHook(() => useCategoryTreeRoots(), {
        wrapper: ReactQueryWrapper,
    });

    expect(result.current).toMatchObject({
        isLoading: true,
        isError: false,
        data: undefined,
        error: null,
    });

    await waitForNextUpdate();

    expect(fetchMock).toHaveBeenCalledWith('/rest/catalogs/categories/tree-roots', expect.any(Object));
    expect(result.current).toMatchObject({
        isLoading: false,
        isError: false,
        data: treeRoots,
        error: null,
    });
});
