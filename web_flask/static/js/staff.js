import API_ENDPOINTS from './apiEndpoint.js';

$(document).ready(function () {
  let HOST = API_ENDPOINTS;
  let userId = null;
const showloader = () => {
    Swal.fire({
        title: 'Processing...Please wait!',
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
}


  // Show the 'Addstaff' button and hide the 'updateStaff' button
  $('.createStaff').on('click', function(){
    $('#Addstaff').show();
    $('#updateStaff').hide();
  })

  // Add a new staff member
  $("#Addstaff").on("click", function (event) {
    event.preventDefault();
    let form = $("#staffFrom")[0];
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    let formData = {
      campus: $("#campus").val(),
      name: $("#staffName").val(),
      email: $("#staffEmail").val(),
      phone: $("#staffPhone").val(),
      password: $("#staffPassword").val(),
      role: $("#staffRole").val(),
      status: $("#status").val(),
    };
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Add this User?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
    }).then((result) => {
      if (result.isConfirmed) {
        showloader()
        $.ajax({
          url: HOST + "staff",
          type: "POST",
          data: JSON.stringify(formData),
          contentType: "application/json",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + localStorage.getItem("token"));
          },
          success: function (response) {
//            console.log("Success:", response);
            Swal.fire({
              title: "Form Submitted!",
              text: "Your form has been submitted successfully.",
              icon: "success",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
            }).then(() => {
              form.reset();
              location.reload();
            });
          },
          error: function (xhr, status, error) {
            console.error("Error:", error);
            let errorMessage = "An error occurred. Please try again.";
            if (xhr.responseJSON && xhr.responseJSON.message) {
              errorMessage = xhr.responseJSON.message;
            }
            Swal.fire({
              title: "Error!",
              text: errorMessage,
              icon: "error",
              showCancelButton: false,
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });
          },
        });
      }
    });
  });

  // Edit a user's details
  $(".edit-user").on("click", function (event) {
    event.preventDefault();
    userId = $(this).data("user-id");
    let row = $(this).closest("tr");
    // let campus = row.find("td:eq(1)").text();
    let name = row.find("td:eq(1)").text();
    let email = row.find("td:eq(2)").text();
    let phone = row.find("td:eq(3)").text();
    let role = row.find("td:eq(4)").text();
    let status = row.find("td:eq(5)").text();

    $("#campus").val(campus);

    $("#staffRole option")
      .filter(function () {
        return $(this).text() === role;
      })
      .prop("selected", true);

    $("#status option")
      .filter(function () {
        return $(this).text() === status;
      })
      .prop("selected", true);

    $("#staffName").val(name);
    $("#staffEmail").val(email);
    $("#staffPhone").val(phone);

    $('#Addstaff').hide();
    $('#updateStaff').show();

    $("#staffCreateUpdate").modal("show");
  });

  // Update a user's details
  $("#updateStaff").on("click", function (event) {
    event.preventDefault();
    let form = $("#staffFrom")[0];
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    let formData = {
      campus: $("#campus").val(),
      name: $("#name").val(),
      email: $("#email").val(),
      phone: $("#phone").val(),
      password: $("#password").val(),
      role: $("#role").val(),
      status: $("#status").val(),
    };
    let password = $("#password").val();


    Swal.fire({
      title: "Are you sure?",
      text: "You are about to update this user. Confirm?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        showloader()
        $.ajax({
          url: HOST + "staff/" + userId,
          type: "PUT",
          data: JSON.stringify(formData),
          contentType: "application/json",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + localStorage.getItem("token"));
          },
          success: function (response) {
            console.log("User updated:", response);
            Swal.fire({
              title: "Success!",
              text: "User has been updated successfully.",
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
            }).then(() => {
              location.reload()
              $("#staffCreateUpdate").modal("hide");
            });
          },
          error: function (xhr, status, error) {
            Swal.fire({
              title: "Error!",
              text: error,
              icon: "error",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });
          },
        });
      }
    });
  });

  // Delete a user
  $(".delete-user").on("click", function (event) {
    event.preventDefault();
    let userId = $(this).data("user-id");
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this user. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        showloader()
        $.ajax({
          url: HOST + "staff/" + userId,
          method: "DELETE",
          success: function (response) {
            Swal.fire({
              title: "Deleted!",
              text: "The user has been deleted.",
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
            }).then(() => {
              location.reload();
            });
          },
          error: function (xhr, status, error) {
            console.error("Error deleting user:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the user.",
              icon: "error",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });
          },
        });
      }
    });
  });

  // Update a user's details without password change
  $("#uStaff").on("click", function (event) {
    event.preventDefault();
    let form = $("#staffFrom")[0];
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    let formData = {
      campus: $("#campus").val(),
      name: $("#name").val(),
      email: $("#email").val(),
      phone: $("#phone").val(),
      password: $("#password").val(),
    };
    let userId = $(this).data("staff-id");
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to update the user. Confirm?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        showloader()
        $.ajax({
          url: HOST + "staff/" + userId,
          type: "PUT",
          data: JSON.stringify(formData),
          contentType: "application/json",
          success: function (response) {
            console.log("User updated:", response);
            Swal.fire({
              title: "Success!",
              text: "User has been updated successfully.",
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
            }).then(() => {
              $("#staffCreateUpdate").modal("hide");
              $("#password").val("");
            });
          },
          error: function (xhr, status, error) {
            Swal.fire({
              title: "Error!",
              text: error,
              icon: "error",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK",
            });
          },
        });
      }
    });
  });
  
  userId = null;

});

