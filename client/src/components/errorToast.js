// components/ErrorToast.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { errorSelector, clearError } from "../redux/errorReducer/errorReducer";

export default function ErrorToast() {
  const { errorMessage } = useSelector(errorSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearError());
    }
  }, [errorMessage, dispatch]);

  return null;
}
