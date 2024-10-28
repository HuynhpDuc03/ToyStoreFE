import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import * as BlogService from "../../services/BlogService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { formatDistanceToNow } from "date-fns";
import { vi, en } from "date-fns/locale"; // Import locale tiếng Việt nếu bạn cần
import { formatDateBlog } from "../../utils";

const BlogPageDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const fetchBlogDetail = async () => {
    const res = await BlogService.getDetailBlogs(id);
    return res.data;
  };

  const { isLoading, data: blogDetails } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogDetail,
  });

  const [commentText, setCommentText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const queryClient = useQueryClient(); // Get queryClient to invalidate queries

  // Mutation hook to handle comment submission using your useMutationHooks function
  const mutation = useMutationHooks((newComment) =>
    BlogService.comments(id, newComment)
  );

  // Handle comment form submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    const newComment = {
      comment: commentText,
      name,
      email,
      phone,
    };

    mutation.mutate(newComment, {
      onSuccess: () => {
        queryClient.invalidateQueries(["blogs", id]); // Refresh the blog details to show new comments
        // Reset form fields after successful submission
        setCommentText("");
        setName("");
        setEmail("");
        setPhone("");
      },
      onError: (error) => {
        console.error("Error submitting comment:", error);
      },
    });
  };

  return (
    <LoadingComponent isLoading={isLoading}>
      <section className="blog-hero spad">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-9 text-center">
              <div className="blog__hero__text">
                <h2>{blogDetails?.title}</h2>
                <ul>
                  <li>
                    {t("pageBlogDetails.author")} {blogDetails?.author}
                  </li>
                  <li>{formatDateBlog(blogDetails?.createdAt)}</li>
                  <li>
                    {blogDetails?.comments.length}{" "}
                    {t("pageBlogDetails.comments")}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-details spad">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-12">
              <div className="blog__details__pic">
                <img src={blogDetails?.bannerImage} alt="" />
              </div>
            </div>
            <div className="col-lg-8">
              <div className="blog__details__content">
                <div className="blog__details__share">
                  <span>{t("pageBlogDetails.share")}</span>
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="twitter">
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="youtube">
                        <i className="fa fa-youtube-play"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="linkedin">
                        <i className="fa fa-linkedin"></i>
                      </a>
                    </li>
                  </ul>
                </div>
                <div
                  className="blog__details__text"
                  dangerouslySetInnerHTML={{ __html: blogDetails?.content }}
                ></div>
                <div className="blog__details__comment">
                  <h4>{t("pageBlogDetails.titleComment")}</h4>
                  {blogDetails?.comments.map((comment, index) => (
                    <div style={{borderBottom:"1px solid #ccc",fontSize:"16px",}}  key={comment._id || index} className="single-comment mt-3">
                      <p style={{ fontWeight:"bold"}}>
                        {comment.name || t("pageBlogDetails.anonymous")}
                        {" "}
                        <small>
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </small>
                      </p>
                     
                      <p>{comment.comment || t("pageBlogDetails.noComment")}</p>
                      
                    </div>
                  ))}
                </div>
                <div className="blog__details__option">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <div className="blog__details__author">
                        <div className="blog__details__author__pic">
                          <img
                            src={require("../../img/blog/details/blog-author.jpg")}
                            alt=""
                          />
                        </div>
                        <div className="blog__details__author__text">
                          <h5>Aiden Blair</h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <div className="blog__details__tags">
                        {blogDetails?.tags.map((tag, index) => (
                          <a key={index} href="#">
                            #{tag}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="blog__details__btns">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <a href="" className="blog__details__btns__item">
                        <p>
                          <span className="arrow_left"></span>{" "}
                          {t("pageBlogDetails.previousPod")}
                        </p>
                        <h5>
                          It S Classified How To Utilize Free Classified Ad
                          Sites
                        </h5>
                      </a>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <a
                        href=""
                        className="blog__details__btns__item blog__details__btns__item--next"
                      >
                        <p>
                          {t("pageBlogDetails.nextPod")}{" "}
                          <span className="arrow_right"></span>
                        </p>
                        <h5>
                          Tips For Choosing The Perfect Gloss For Your Lips
                        </h5>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="blog__details__comment">
                  <h4>{t("pageBlogDetails.titleComment")}</h4>
                  <form onSubmit={handleCommentSubmit}>
                    <div className="row">
                      <div className="col-lg-4 col-md-4">
                        <input
                          type="text"
                          value={name}
                          placeholder={t("pageBlogDetails.name")}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <input
                          type="email"
                          value={email}
                          placeholder={t("pageBlogDetails.email")}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-lg-4 col-md-4">
                        <input
                          type="tel"
                          value={phone}
                          placeholder={t("pageBlogDetails.phone")}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-12 text-center">
                        <textarea
                          value={commentText}
                          placeholder={t("pageBlogDetails.comment")}
                          onChange={(e) => setCommentText(e.target.value)}
                          required
                        ></textarea>
                        <button type="submit" className="site-btn">
                          {t("pageBlogDetails.btnPost")}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LoadingComponent>
  );
};

export default BlogPageDetails;
