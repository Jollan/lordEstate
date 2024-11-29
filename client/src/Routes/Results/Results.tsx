import "./Results.scss";
import Filter from "./Filter/Filter";
import List from "../../components/List/List";
import Page from "../../components/Page/Page";
import {
  Await,
  defer,
  LoaderFunction,
  useAsyncValue,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import { searchPosts } from "../../services/post";
import { SearchParams, SearchResponse } from "../../models/post.model";
import { Suspense, useContext, useEffect, useState } from "react";
import ResultsPlaceholder from "./ResultsPlaceholder/ResultsPlaceholder";
import { isEmpty, isEqual, pick, keys } from "lodash-es";
import { sanitize } from "../../lib/utils";
import { Pagination, Icon } from "semantic-ui-react";
import Map from "../../components/Map/Map";
import AsyncErrorPage from "../ErrorPage/AsyncErrorPage/AsyncErrorPage";
import { LoaderContext } from "../../context/Loader.context";

interface LoaderData {
  res: Axios.IPromise<Axios.AxiosXHR<SearchResponse>>;
}

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const query = url.search;
  const res = searchPosts(query);
  return defer({ res });
};

const Results = () => {
  const data = useLoaderData() as LoaderData;

  return (
    <Page className="results" responsivity>
      <Suspense fallback={<ResultsPlaceholder />}>
        <Await resolve={data.res} errorElement={<AsyncErrorPage />}>
          <_Results />
        </Await>
      </Suspense>
    </Page>
  );
};

const _Results = () => {
  const { data } = useAsyncValue() as Axios.AxiosXHR<SearchResponse>;
  const [searchParams, setSearchParams] = useSearchParams();
  const { setLoading } = useContext(LoaderContext);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  const urlSearchParams = {
    city: searchParams.get("city") || "",
    type: searchParams.get("type") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
    page: searchParams.get("page") || "",
  } as SearchParams;
  const _urlSearchParams = sanitize(urlSearchParams);

  const [filterParams, setFilterParams] = useState(urlSearchParams);
  const _filterParams = sanitize(filterParams);

  const { minPrice, maxPrice, page, ...rest } = _filterParams;

  const filteredPosts =
    !isEmpty(_filterParams) &&
    !isEqual(_filterParams, _urlSearchParams) &&
    data.posts
      .filter((post) => {
        if (minPrice && maxPrice) {
          return post.price >= +minPrice && post.price <= +maxPrice;
        } else if (minPrice) {
          return post.price >= +minPrice;
        } else if (maxPrice) {
          return post.price <= +maxPrice;
        } else {
          return true;
        }
      })
      .filter((post) => {
        const _post = {
          ...post,
          city: post.city?.name,
          bedroom: post.bedroom.toString(),
        };
        const partial = pick(_post, keys(rest));
        return isEqual(partial, rest);
      });

  const posts = filteredPosts || data.posts;

  const handlePaginationChange = ({ activePage }: any) => {
    const params = { ..._filterParams, page: activePage.toString() };
    if (!isEqual(_urlSearchParams, params)) {
      setLoading(true);
      setFilterParams(params);
      setSearchParams(params);
    }
  };

  return (
    <>
      <Page.PageLeft>
        <div className="content">
          <Filter
            searchParams={urlSearchParams}
            onSearch={setSearchParams}
            filterParams={filterParams}
            onFilterChange={setFilterParams}
          />
          <div className="post list">
            <List data={posts} />
          </div>
          {data.nbPage > 1 && (
            <div className="pagination">
              <Pagination
                inverted
                pageItem={{ color: "yellow" }}
                defaultActivePage={+page || 1}
                totalPages={data.nbPage}
                ellipsisItem={{
                  content: <Icon name="ellipsis horizontal" />,
                  icon: true,
                }}
                firstItem={{
                  content: <Icon name="angle double left" />,
                  icon: true,
                }}
                lastItem={{
                  content: <Icon name="angle double right" />,
                  icon: true,
                }}
                prevItem={{ content: <Icon name="angle left" />, icon: true }}
                nextItem={{ content: <Icon name="angle right" />, icon: true }}
                onPageChange={(_e, data) => handlePaginationChange(data)}
              />
            </div>
          )}
        </div>
      </Page.PageLeft>
      <Page.PageRight>
        <div className="content">
          <Map postList={posts} />
        </div>
      </Page.PageRight>
    </>
  );
};

export default Results;
